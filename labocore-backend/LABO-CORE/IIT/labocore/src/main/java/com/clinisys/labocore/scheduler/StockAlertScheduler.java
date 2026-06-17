package com.clinisys.labocore.scheduler;

import com.clinisys.labocore.controller.StockAlertController;
import com.clinisys.labocore.dto.StockAlertDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Component
public class StockAlertScheduler {

    private static final Logger log = LoggerFactory.getLogger(StockAlertScheduler.class);

    private static final String DAILY_CRON = "0 0 8 * * MON-FRI";
    private static final String WORKING_HOURS_CRON = "0 0 8-18 * * MON-FRI";

    @Autowired
    private StockAlertController stockAlertController;

    private LocalDateTime lastRunAt;
    private LocalDate countsDate;
    private int totalSentToday;
    private int totalSkippedToday;

    @Scheduled(cron = DAILY_CRON)
    public void dailyStockCheck() {
        log.info("Daily stock check starting...");
        runSmartCheck();
    }

    @Scheduled(cron = WORKING_HOURS_CRON)
    public void workingHoursCheck() {
        log.info("Working-hours stock check starting...");
        runSmartCheck();
    }

    private synchronized void runSmartCheck() {
        lastRunAt = LocalDateTime.now();
        resetCountsIfNewDay();

        List<StockAlertDto> criticalAlerts = stockAlertController.getLowStockAlerts();
        if (criticalAlerts.isEmpty()) {
            log.info("Stock levels normal — no alerts needed");
            return;
        }

        Map<String, Object> result = stockAlertController.notifyAllSuppliers();
        int sent = (int) result.get("sent");
        int skipped = (int) result.get("skipped");
        int failed = (int) result.get("failed");

        totalSentToday += sent;
        totalSkippedToday += skipped;

        if (sent == 0 && failed == 0 && skipped >= criticalAlerts.size()) {
            log.info("All critical articles already notified — skipping");
        } else {
            log.info("Smart check complete: sent={}, skipped={}, failed={}", sent, skipped, failed);
        }
    }

    private void resetCountsIfNewDay() {
        LocalDate today = LocalDate.now();
        if (!today.equals(countsDate)) {
            countsDate = today;
            totalSentToday = 0;
            totalSkippedToday = 0;
        }
    }

    public synchronized LocalDateTime getLastRunAt() {
        return lastRunAt;
    }

    public LocalDateTime getNextRunAt() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextDaily = CronExpression.parse(DAILY_CRON).next(now);
        LocalDateTime nextWorking = CronExpression.parse(WORKING_HOURS_CRON).next(now);
        if (nextDaily == null) {
            return nextWorking;
        }
        if (nextWorking == null) {
            return nextDaily;
        }
        return nextDaily.isBefore(nextWorking) ? nextDaily : nextWorking;
    }

    public synchronized int getTotalSentToday() {
        resetCountsIfNewDay();
        return totalSentToday;
    }

    public synchronized int getTotalSkippedToday() {
        resetCountsIfNewDay();
        return totalSkippedToday;
    }
}
