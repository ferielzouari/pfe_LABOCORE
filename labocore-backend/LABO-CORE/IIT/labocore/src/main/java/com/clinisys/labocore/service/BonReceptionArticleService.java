package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.BonReceptionArticleDto;
import com.clinisys.labocore.dto.PagedResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
public class BonReceptionArticleService {

    // ---------------------------------------------------------------
    // Mock data — replace with repository calls when SQL Server is wired
    // ---------------------------------------------------------------
    private static final List<BonReceptionArticleDto> MOCK_DATA = List.of(
            new BonReceptionArticleDto("BRA-2024-001", LocalDateTime.of(2024, 1, 5, 8, 30),  "FRS001", "PharmaTech Algérie",   "ART-100", "Réactif Hématologie Sysmex XN",  50.0,  48.0, 48.0, 1),
            new BonReceptionArticleDto("BRA-2024-001", LocalDateTime.of(2024, 1, 5, 8, 30),  "FRS001", "PharmaTech Algérie",   "ART-101", "Contrôle Hématologie Niveau 1",  10.0,  10.0, 10.0, 1),
            new BonReceptionArticleDto("BRA-2024-002", LocalDateTime.of(2024, 1, 12, 9, 0),  "FRS002", "BioMérieux DZ",        "ART-200", "Kit Biochimie Cobas c311",        30.0,  30.0, 28.0, 2),
            new BonReceptionArticleDto("BRA-2024-002", LocalDateTime.of(2024, 1, 12, 9, 0),  "FRS002", "BioMérieux DZ",        "ART-201", "Calibrateur Biochimie Multi",      5.0,   5.0,  5.0, 2),
            new BonReceptionArticleDto("BRA-2024-003", LocalDateTime.of(2024, 1, 20, 10, 15),"FRS003", "Roche Diagnostics DZ", "ART-300", "Réactif CRP Haute Sensibilité",   20.0,  20.0, 20.0, 2),
            new BonReceptionArticleDto("BRA-2024-004", LocalDateTime.of(2024, 2, 3, 8, 0),   "FRS001", "PharmaTech Algérie",   "ART-102", "Lame Frottis Sanguins (100u)",   200.0, 200.0,null, 1),
            new BonReceptionArticleDto("BRA-2024-004", LocalDateTime.of(2024, 2, 3, 8, 0),   "FRS001", "PharmaTech Algérie",   "ART-103", "Colorant Wright-Giemsa 500ml",    12.0,  12.0, 12.0, 1),
            new BonReceptionArticleDto("BRA-2024-005", LocalDateTime.of(2024, 2, 14, 11, 0), "FRS004", "Siemens Healthineers",  "ART-400", "Réactif Coagulation STA-R",       15.0,  15.0, 15.0, 3),
            new BonReceptionArticleDto("BRA-2024-005", LocalDateTime.of(2024, 2, 14, 11, 0), "FRS004", "Siemens Healthineers",  "ART-401", "Contrôle Coagulation Niveau 2",    8.0,   8.0,  8.0, 3),
            new BonReceptionArticleDto("BRA-2024-006", LocalDateTime.of(2024, 2, 22, 9, 30), "FRS002", "BioMérieux DZ",        "ART-202", "Réactif VIDAS Troponine I",        6.0,   6.0,  6.0, 2),
            new BonReceptionArticleDto("BRA-2024-007", LocalDateTime.of(2024, 3, 1, 8, 0),   "FRS005", "Abbott Diagnostics DZ","ART-500", "Réactif Immunologie Architect",   25.0,  24.0, 24.0, 4),
            new BonReceptionArticleDto("BRA-2024-007", LocalDateTime.of(2024, 3, 1, 8, 0),   "FRS005", "Abbott Diagnostics DZ","ART-501", "Calibrateur Hormones Thyroïd",     4.0,   4.0,  4.0, 4),
            new BonReceptionArticleDto("BRA-2024-008", LocalDateTime.of(2024, 3, 10, 10, 0), "FRS003", "Roche Diagnostics DZ", "ART-301", "Réactif HbA1c Cobas",             18.0,  18.0, 18.0, 2),
            new BonReceptionArticleDto("BRA-2024-009", LocalDateTime.of(2024, 3, 18, 9, 0),  "FRS006", "Beckman Coulter DZ",   "ART-600", "Réactif Urée Enzymatique",        40.0,  40.0, 38.0, 2),
            new BonReceptionArticleDto("BRA-2024-009", LocalDateTime.of(2024, 3, 18, 9, 0),  "FRS006", "Beckman Coulter DZ",   "ART-601", "Réactif Créatinine Jaffé",        40.0,  39.0, 39.0, 2),
            new BonReceptionArticleDto("BRA-2024-010", LocalDateTime.of(2024, 4, 2, 8, 30),  "FRS001", "PharmaTech Algérie",   "ART-104", "Tubes EDTA 5ml Vacutainer (100u)",500.0, 500.0,null, 1),
            new BonReceptionArticleDto("BRA-2024-010", LocalDateTime.of(2024, 4, 2, 8, 30),  "FRS001", "PharmaTech Algérie",   "ART-105", "Tubes Citratés 2.7ml (100u)",     300.0, 300.0,null, 3),
            new BonReceptionArticleDto("BRA-2024-011", LocalDateTime.of(2024, 4, 15, 11, 0), "FRS004", "Siemens Healthineers",  "ART-402", "Réactif D-Dimères STA-R",         10.0,  10.0, 10.0, 3),
            new BonReceptionArticleDto("BRA-2024-012", LocalDateTime.of(2024, 5, 5, 9, 0),   "FRS002", "BioMérieux DZ",        "ART-203", "Kit ELISA Hépatite B AgHbs",      50.0,  48.0, 48.0, 5),
            new BonReceptionArticleDto("BRA-2024-012", LocalDateTime.of(2024, 5, 5, 9, 0),   "FRS002", "BioMérieux DZ",        "ART-204", "Kit ELISA Anti-HCV",              50.0,  50.0, 50.0, 5),
            new BonReceptionArticleDto("BRA-2024-013", LocalDateTime.of(2024, 5, 20, 8, 0),  "FRS005", "Abbott Diagnostics DZ","ART-502", "Réactif PSA Total Architect",     12.0,  12.0, 12.0, 4),
            new BonReceptionArticleDto("BRA-2024-014", LocalDateTime.of(2024, 6, 3, 10, 0),  "FRS003", "Roche Diagnostics DZ", "ART-302", "Réactif Ferritine Cobas",         14.0,  14.0, 14.0, 4),
            new BonReceptionArticleDto("BRA-2024-014", LocalDateTime.of(2024, 6, 3, 10, 0),  "FRS003", "Roche Diagnostics DZ", "ART-303", "Réactif Vitamine D Cobas",        16.0,  16.0, 15.0, 4),
            new BonReceptionArticleDto("BRA-2024-015", LocalDateTime.of(2024, 6, 18, 9, 30), "FRS006", "Beckman Coulter DZ",   "ART-602", "Réactif Glucose Hexokinase",      60.0,  60.0, 58.0, 2),
            new BonReceptionArticleDto("BRA-2024-015", LocalDateTime.of(2024, 6, 18, 9, 30), "FRS006", "Beckman Coulter DZ",   "ART-603", "Réactif Cholestérol Total",       45.0,  45.0, 45.0, 2),
            new BonReceptionArticleDto("BRA-2024-016", LocalDateTime.of(2024, 7, 1, 8, 0),   "FRS007", "Sysmex France",        "ART-700", "Réactif WBC Diff Sysmex XN",      24.0,  24.0, 24.0, 1),
            new BonReceptionArticleDto("BRA-2024-016", LocalDateTime.of(2024, 7, 1, 8, 0),   "FRS007", "Sysmex France",        "ART-701", "Solution Rinçage Sysmex CELLPACK", 6.0,   6.0,  null,1),
            new BonReceptionArticleDto("BRA-2024-017", LocalDateTime.of(2024, 7, 22, 11, 0), "FRS002", "BioMérieux DZ",        "ART-205", "Bandelettes Urinaires 10 param.",100.0, 100.0,null, 6),
            new BonReceptionArticleDto("BRA-2024-018", LocalDateTime.of(2024, 8, 5, 9, 0),   "FRS001", "PharmaTech Algérie",   "ART-106", "Gants Nitrile Taille M (100u)",  500.0, 500.0,null, 7),
            new BonReceptionArticleDto("BRA-2024-019", LocalDateTime.of(2024, 8, 20, 10, 0), "FRS004", "Siemens Healthineers",  "ART-403", "Réactif Fibrinogène STA-R",        8.0,   8.0,  8.0, 3),
            new BonReceptionArticleDto("BRA-2024-020", LocalDateTime.of(2024, 9, 3, 8, 30),  "FRS003", "Roche Diagnostics DZ", "ART-304", "Réactif TSH Cobas Elecsys",       20.0,  20.0, 20.0, 4),
            new BonReceptionArticleDto("BRA-2024-020", LocalDateTime.of(2024, 9, 3, 8, 30),  "FRS003", "Roche Diagnostics DZ", "ART-305", "Réactif FT4 Cobas Elecsys",       18.0,  18.0, 18.0, 4),
            new BonReceptionArticleDto("BRA-2024-021", LocalDateTime.of(2024, 9, 17, 9, 0),  "FRS005", "Abbott Diagnostics DZ","ART-503", "Réactif Anti-TG Architect",       10.0,  10.0, 10.0, 4),
            new BonReceptionArticleDto("BRA-2024-022", LocalDateTime.of(2024, 10, 1, 8, 0),  "FRS006", "Beckman Coulter DZ",   "ART-604", "Réactif ASAT/GOT",                50.0,  50.0, 48.0, 2),
            new BonReceptionArticleDto("BRA-2024-022", LocalDateTime.of(2024, 10, 1, 8, 0),  "FRS006", "Beckman Coulter DZ",   "ART-605", "Réactif ALAT/GPT",                50.0,  49.0, 49.0, 2)
    );

    public PagedResponse<BonReceptionArticleDto> findAll(int page, int size, String search) {
        if (page < 1) throw new IllegalArgumentException("Page must be >= 1");
        if (size < 1 || size > 100) throw new IllegalArgumentException("Size must be between 1 and 100");

        Stream<BonReceptionArticleDto> stream = MOCK_DATA.stream();

        if (search != null && !search.isBlank()) {
            String term = search.trim().toLowerCase();
            stream = stream.filter(dto -> containsIgnoreCase(dto.numbon(), term)
                    || containsIgnoreCase(dto.codart(), term)
                    || containsIgnoreCase(dto.desart(), term)
                    || containsIgnoreCase(dto.raiSoc(), term));
        }

        List<BonReceptionArticleDto> filtered = stream.toList();
        long total = filtered.size();

        int fromIndex = (page - 1) * size;
        if (fromIndex >= total && total > 0) {
            throw new IllegalArgumentException(
                    "Page %d out of range — total items: %d, page size: %d".formatted(page, total, size));
        }

        int toIndex = (int) Math.min((long) fromIndex + size, total);
        List<BonReceptionArticleDto> pageItems = fromIndex < total
                ? filtered.subList(fromIndex, toIndex)
                : List.of();

        return new PagedResponse<>(pageItems, page, size, total);
    }

    private boolean containsIgnoreCase(String field, String term) {
        return field != null && field.toLowerCase().contains(term);
    }
}