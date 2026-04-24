package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.ArticleDetailsDto;
import com.clinisys.labocore.dto.ArticleSaveRequest;   // ← must be this
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.entity.*;
import com.clinisys.labocore.exception.ResourceNotFoundException;
import com.clinisys.labocore.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@Transactional
public class FicheArticleServiceImpl implements FicheArticleService {

    private static final String DEFAULT_MODE_GESTION = "Par unité";

    private final FicheArticleRepository                  ficheRepo;
    private final DetailsArticleFicheSecuriteRepository   securiteRepo;
    private final DetailsArticleMentionRisqueRepository   mentionRepo;
    private final DetailsArticlePrudenceRepository        prudenceRepo;
    private final DetailsArticleExamenRepository          examenRepo;
    private final DetailsArticleAutomateRepository        automateRepo;

    public FicheArticleServiceImpl(
            FicheArticleRepository ficheRepo,
            DetailsArticleFicheSecuriteRepository securiteRepo,
            DetailsArticleMentionRisqueRepository mentionRepo,
            DetailsArticlePrudenceRepository prudenceRepo,
            DetailsArticleExamenRepository examenRepo,
            DetailsArticleAutomateRepository automateRepo) {
        this.ficheRepo    = ficheRepo;
        this.securiteRepo = securiteRepo;
        this.mentionRepo  = mentionRepo;
        this.prudenceRepo = prudenceRepo;
        this.examenRepo   = examenRepo;
        this.automateRepo = automateRepo;
    }

    // ── List ──────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ArticleDetailsDto> listArticles(
            int page, int size, String code, String designation) {

        PageRequest pageable = PageRequest.of(page - 1, size,
                Sort.by("codeArticle").ascending());

        String codeFilter        = blankToNull(code);
        String designationFilter = blankToNull(designation);

        Page<FicheArticle> result = ficheRepo.search(codeFilter, designationFilter, pageable);

        List<ArticleDetailsDto> items = result.getContent()
                .stream()
                .map(this::toDto)
                .toList();

        return PagedResponse.of(items, page, size, result.getTotalElements());
    }

    // ── Get one ───────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public ArticleDetailsDto getArticleDetails(String codeArticle) {
        return toDto(findOrThrow(codeArticle));
    }

    // ── Create ────────────────────────────────────────────────────────────

    @Override
    public ArticleDetailsDto createArticle(ArticleSaveRequest req) {
        if (ficheRepo.existsById(req.codeArticle())) {
            throw new IllegalArgumentException(
                    "Article with code '" + req.codeArticle() + "' already exists");
        }

        FicheArticle fiche = buildFiche(req.codeArticle(), req);
        ficheRepo.save(fiche);

        insertChildren(req.codeArticle(), req);

        // ── TODO: mark Article.parametrer_labo = 1 ───────────────────────
        // When the Article table entity is available, inject its repository
        // and call: articleRepository.markParametrerLabo(req.codeArticle());
        // ─────────────────────────────────────────────────────────────────

        return getArticleDetails(req.codeArticle());
    }

    // ── Update ────────────────────────────────────────────────────────────

    @Override
    public ArticleDetailsDto updateArticle(String codeArticle, ArticleSaveRequest req) {
        FicheArticle fiche = findOrThrow(codeArticle);

        applyUpdate(fiche, req);
        ficheRepo.save(fiche);

        // Delete all existing child rows, then reinsert from request
        deleteChildren(codeArticle);
        insertChildren(codeArticle, req);

        // ── TODO: mark Article.parametrer_labo = 1 ───────────────────────
        // articleRepository.markParametrerLabo(codeArticle);
        // ─────────────────────────────────────────────────────────────────

        return getArticleDetails(codeArticle);
    }

    // ── Delete ────────────────────────────────────────────────────────────

    @Override
    public void deleteArticle(String codeArticle) {
        FicheArticle fiche = findOrThrow(codeArticle);
        deleteChildren(codeArticle);
        ficheRepo.delete(fiche);
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private FicheArticle findOrThrow(String codeArticle) {
        return ficheRepo.findById(codeArticle)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "FicheArticle not found with code: " + codeArticle));
    }

    private FicheArticle buildFiche(String code, ArticleSaveRequest req) {
        FicheArticle f = new FicheArticle();
        f.setCodeArticle(code);
        applyUpdate(f, req);
        return f;
    }

    private void applyUpdate(FicheArticle f, ArticleSaveRequest req) {
        f.setDesignationFr(req.designationFr());
        f.setDesignationEn(nullToEmpty(req.designationEn()));
        f.setDureUtilisation(nullToEmpty(req.dureUtilisation()));
        f.setUniteDure(nullToEmpty(req.uniteDure()));
        f.setUom(nullToEmpty(req.uom()));
        f.setYieldValue(nullToEmpty(req.yieldValue()));
        f.setUnite(nullToEmpty(req.unite()));
        f.setPrecisionValue(nullToEmpty(req.precisionValue()));
        f.setType(nullToEmpty(req.type()));
        f.setAlerteAvant(nullToEmpty(req.alerteAvant()));

        // Business default: mode_gestion falls back to "Par unité"
        String mode = req.modeGestion();
        f.setModeGestion((mode != null && !mode.isBlank()) ? mode : DEFAULT_MODE_GESTION);
    }

    /**
     * Inserts all child rows for a given codeArticle from the request.
     * Each saveAll() is a single batch INSERT — no string concatenation.
     */
    private void insertChildren(String codeArticle, ArticleSaveRequest req) {
        if (req.ficheSecuriteIds() != null) {
            securiteRepo.saveAll(
                    req.ficheSecuriteIds().stream()
                            .map(id -> new DetailsArticleFicheSecurite(codeArticle, id))
                            .toList()
            );
        }
        if (req.mentionRisqueIds() != null) {
            mentionRepo.saveAll(
                    req.mentionRisqueIds().stream()
                            .map(id -> new DetailsArticleMentionRisque(codeArticle, id))
                            .toList()
            );
        }
        if (req.prudenceIds() != null) {
            prudenceRepo.saveAll(
                    req.prudenceIds().stream()
                            .map(id -> new DetailsArticlePrudence(codeArticle, id))
                            .toList()
            );
        }
        // examens is guaranteed non-empty by @NotEmpty validation
        examenRepo.saveAll(
                req.examens().stream()
                        .map(code -> new DetailsArticleExamen(codeArticle, code))
                        .toList()
        );
        if (req.automates() != null) {
            automateRepo.saveAll(
                    req.automates().stream()
                            .map(code -> new DetailsArticleAutomate(codeArticle, code))
                            .toList()
            );
        }
    }

    /**
     * Deletes all child rows for a given codeArticle across all five tables.
     * Called before reinsert on update, and before delete on article removal.
     */
    private void deleteChildren(String codeArticle) {
        securiteRepo.deleteByCodeArticle(codeArticle);
        mentionRepo.deleteByCodeArticle(codeArticle);
        prudenceRepo.deleteByCodeArticle(codeArticle);
        examenRepo.deleteByCodeArticle(codeArticle);
        automateRepo.deleteByCodeArticle(codeArticle);
    }

    // ── Entity → DTO ──────────────────────────────────────────────────────

    private ArticleDetailsDto toDto(FicheArticle f) {
        String code = f.getCodeArticle();

        List<Integer> securiteIds = securiteRepo
                .findAll()
                .stream()
                .filter(s -> code.equals(s.getId().getCodeArticle()))
                .map(s -> s.getId().getIdSecurite())
                .toList();

        List<Integer> mentionIds = mentionRepo
                .findAll()
                .stream()
                .filter(m -> code.equals(m.getId().getCodeArticle()))
                .map(m -> m.getId().getIdMention())
                .toList();

        List<Integer> prudenceIds = prudenceRepo
                .findAll()
                .stream()
                .filter(p -> code.equals(p.getId().getCodeArticle()))
                .map(p -> p.getId().getIdPrudence())
                .toList();

        List<String> examens   = examenRepo.findCodeDemandeByCodeArticle(code);
        List<String> automates = automateRepo.findCodeAutomateByCodeArticle(code);

        return new ArticleDetailsDto(
                f.getCodeArticle(),
                f.getDesignationFr(),
                f.getDesignationEn(),
                f.getDureUtilisation(),
                f.getUniteDure(),
                f.getUom(),
                f.getYieldValue(),
                f.getUnite(),
                f.getPrecisionValue(),
                f.getType(),
                f.getModeGestion(),
                f.getAlerteAvant(),
                securiteIds,
                mentionIds,
                prudenceIds,
                examens,
                automates
        );
    }

    // ── Utilities ─────────────────────────────────────────────────────────

    private String blankToNull(String s) {
        return (s != null && !s.isBlank()) ? s : null;
    }

    private String nullToEmpty(String s) {
        return s != null ? s : "";
    }
}