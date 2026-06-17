package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.NotificationLogDto;
import com.clinisys.labocore.dto.StockAlertDto;
import com.clinisys.labocore.entity.BonReception;
import com.clinisys.labocore.entity.BonReceptionArticle;
import com.clinisys.labocore.entity.Fournisseur;
import com.clinisys.labocore.entity.NotificationLog;
import com.clinisys.labocore.entity.StockEntity;
import com.clinisys.labocore.repository.BonReceptionArticleRepository;
import com.clinisys.labocore.repository.BonReceptionRepository;
import com.clinisys.labocore.repository.FournisseurRepository;
import com.clinisys.labocore.repository.NotificationLogRepository;
import com.clinisys.labocore.repository.StockRepository;
import com.clinisys.labocore.scheduler.StockAlertScheduler;
import org.springframework.context.annotation.Lazy;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stock-alerts")
public class StockAlertController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(StockAlertController.class);

    private static final int MAX_CRITICAL_ALERTS = 10;
    private static final int MAX_NOTIFY_ALL_EMAILS = 20;

    private final StockRepository stockRepository;
    private final BonReceptionArticleRepository bonReceptionArticleRepository;
    private final BonReceptionRepository bonReceptionRepository;
    private final FournisseurRepository fournisseurRepository;
    private final JavaMailSender mailSender;
    private final NotificationLogRepository notificationLogRepository;
    private final StockAlertScheduler stockAlertScheduler;

    public StockAlertController(
            StockRepository stockRepository,
            BonReceptionArticleRepository bonReceptionArticleRepository,
            BonReceptionRepository bonReceptionRepository,
            FournisseurRepository fournisseurRepository,
            JavaMailSender mailSender,
            NotificationLogRepository notificationLogRepository,
            @Lazy StockAlertScheduler stockAlertScheduler) {
        this.stockRepository = stockRepository;
        this.bonReceptionArticleRepository = bonReceptionArticleRepository;
        this.bonReceptionRepository = bonReceptionRepository;
        this.fournisseurRepository = fournisseurRepository;
        this.mailSender = mailSender;
        this.notificationLogRepository = notificationLogRepository;
        this.stockAlertScheduler = stockAlertScheduler;
    }

    @GetMapping
    public List<StockAlertDto> getLowStockAlerts() {
        return getTopCriticalStock().stream().map(s -> {
            Fournisseur fournisseur = resolveSupplier(s.getCodart());
            String supplierEmail = fournisseur != null ? fournisseur.getEmail() : null;
            String supplierName = fournisseur != null ? fournisseur.getRaisonSociale() : null;

            return new StockAlertDto(
                    s.getCodart(),
                    s.getDesart(),
                    s.getStkDep(),
                    s.getStkMin(),
                    s.getFamArt(),
                    supplierEmail,
                    supplierName
            );
        }).collect(Collectors.toList());
    }

    /**
     * Return the MAX_CRITICAL_ALERTS most critical low-stock articles, ranked by
     * deficit ratio (stkMin - stkDep) / stkMin, most critical first.
     */
    private List<StockEntity> getTopCriticalStock() {
        return stockRepository.findLowStock().stream()
                .sorted(Comparator.comparing(this::deficitRatio).reversed())
                .limit(MAX_CRITICAL_ALERTS)
                .collect(Collectors.toList());
    }

    private BigDecimal deficitRatio(StockEntity s) {
        return s.getStkMin().subtract(s.getStkDep()).divide(s.getStkMin(), 6, RoundingMode.HALF_UP);
    }

    /**
     * Resolve a supplier for the given article: first via its reception history
     * (BonReceptionArticle -> BonReception -> Fournisseur), falling back to any
     * Fournisseur with a non-null email if no reception-based supplier is found.
     */
    private Fournisseur resolveSupplier(String codart) {
        return resolveRealSupplier(codart)
                .orElseGet(() -> fournisseurRepository.findFirstByEmailIsNotNull().orElse(null));
    }

    /**
     * Resolve the genuine, reception-linked supplier for the given article via
     * BonReceptionArticle -> BonReception -> Fournisseur. Returns empty if no
     * such supplier exists (no fallback).
     */
    private Optional<Fournisseur> resolveRealSupplier(String codart) {
        List<BonReceptionArticle> receptions = bonReceptionArticleRepository.findByCodartOrderByIdDesc(codart);
        if (receptions.isEmpty()) {
            return Optional.empty();
        }
        String numBon = receptions.get(0).getNumBon();
        Optional<BonReception> br = bonReceptionRepository.findByNumBon(numBon);
        if (br.isEmpty()) {
            return Optional.empty();
        }
        return fournisseurRepository.findByCode(br.get().getCodFrs());
    }

    @PostMapping("/notify")
    public Map<String, String> notifySupplier(@RequestBody StockAlertDto alert) {
        String status = sendNotification(alert);
        String message = switch (status) {
            case "Sent" -> "Email sent successfully";
            case "Skipped" -> "Already notified within the last 24 hours";
            default -> "Email sending failed";
        };
        return Map.of("message", message);
    }

    @PostMapping("/notify-all")
    public Map<String, Object> notifyAllSuppliers() {
        List<StockEntity> critical = getTopCriticalStock();

        int sent = 0;
        int skipped = 0;
        int failed = 0;
        int attempted = 0;

        for (StockEntity s : critical) {
            Optional<Fournisseur> fournisseur = resolveRealSupplier(s.getCodart());
            if (fournisseur.isEmpty() || fournisseur.get().getEmail() == null) {
                skipped++;
                continue;
            }
            if (attempted >= MAX_NOTIFY_ALL_EMAILS) {
                skipped++;
                continue;
            }

            StockAlertDto alert = new StockAlertDto(
                    s.getCodart(), s.getDesart(), s.getStkDep(), s.getStkMin(), s.getFamArt(),
                    fournisseur.get().getEmail(), fournisseur.get().getRaisonSociale()
            );

            attempted++;
            String result = sendNotification(alert);
            if ("Sent".equals(result)) {
                sent++;
            } else if ("Skipped".equals(result)) {
                skipped++;
            } else {
                failed++;
            }
        }

        String message = "Sent " + sent + ", skipped " + skipped + " (already notified), failed " + failed;
        return Map.of("sent", sent, "skipped", skipped, "failed", failed, "message", message);
    }

    private String sendNotification(StockAlertDto alert) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        if (notificationLogRepository.existsByCodartAndSentAtAfter(alert.codart(), cutoff)) {
            log.info("Skipping notification for {} — already notified within the last 24h", alert.codart());
            return "Skipped";
        }

        LocalDateTime sentAt = LocalDateTime.now();
        String subject = "LABOCORE — Low Stock Alert: " + alert.desart();
        String body = buildEmailBody(alert);
        String status;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(alert.supplierEmail());
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            status = "Sent";
            log.info("Email sent successfully for article {} to {}", alert.codart(), alert.supplierEmail());
        } catch (Exception e) {
            log.error("Email failed for article {}: {}", alert.codart(), e.getMessage(), e);
            status = "Failed";
        }

        NotificationLog entry = new NotificationLog();
        entry.setCodart(alert.codart());
        entry.setDesart(alert.desart());
        entry.setSupplierName(alert.supplierName());
        entry.setSupplierEmail(alert.supplierEmail());
        entry.setStockLevel(alert.stkDep());
        entry.setSentAt(sentAt);
        entry.setStatus(status);
        entry.setEmailSubject(subject);
        entry.setEmailBody(body);
        notificationLogRepository.save(entry);

        return status;
    }

    private String buildEmailBody(StockAlertDto alert) {
        return "Dear " + alert.supplierName() + ",\n\n" +
                "This is an automated alert from LABOCORE Laboratory System.\n\n" +
                "The following article is running low on stock and requires urgent replenishment:\n\n" +
                "- Article Code: " + alert.codart() + "\n" +
                "- Article Name: " + alert.desart() + "\n" +
                "- Current Stock: " + alert.stkDep() + " units\n\n" +
                "Please arrange delivery at your earliest convenience.\n\n" +
                "Best regards,\n" +
                "LABOCORE Laboratory Team";
    }

    @GetMapping("/logs")
    public List<NotificationLogDto> getLogs() {
        return notificationLogRepository.findAllByOrderBySentAtDesc().stream()
                .map(e -> new NotificationLogDto(
                        e.getCodart(),
                        e.getDesart(),
                        e.getSupplierName(),
                        e.getSupplierEmail(),
                        e.getStockLevel(),
                        e.getSentAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                        e.getStatus()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/scheduler-status")
    public Map<String, Object> getSchedulerStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        LocalDateTime lastRun = stockAlertScheduler.getLastRunAt();
        status.put("lastRunAt", lastRun != null ? lastRun.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        status.put("nextRunAt", stockAlertScheduler.getNextRunAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        status.put("totalSentToday", stockAlertScheduler.getTotalSentToday());
        status.put("totalSkippedToday", stockAlertScheduler.getTotalSkippedToday());
        status.put("status", "Active");
        return status;
    }
}
