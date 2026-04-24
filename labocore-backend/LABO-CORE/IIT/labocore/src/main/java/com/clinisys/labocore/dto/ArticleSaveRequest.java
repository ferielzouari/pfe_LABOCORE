package com.clinisys.labocore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Used for both POST (create) and PUT (update).
 * - codeArticle: required on create, ignored on update (taken from path)
 * - examens: must contain at least one entry (business rule)
 * - modeGestion: defaults to "Par unité" in the service layer if null/blank
 */
public record ArticleSaveRequest(

        // Required on POST, optional on PUT (path variable takes precedence)
        @NotBlank(message = "codeArticle is required")
        String codeArticle,

        @NotBlank(message = "designationFr is required")
        @Size(max = 400)
        String designationFr,

        @Size(max = 400)
        String designationEn,

        @Size(max = 10)
        String dureUtilisation,

        @Size(max = 10)
        String uniteDure,

        @Size(max = 10)
        String uom,

        @Size(max = 10)
        String yieldValue,

        @Size(max = 20)
        String unite,

        @Size(max = 100)
        String precisionValue,

        @Size(max = 50)
        String type,

        // Defaults to "Par unité" if null or blank
        @Size(max = 100)
        String modeGestion,

        @Size(max = 4)
        String alerteAvant,

        List<Integer> ficheSecuriteIds,
        List<Integer> mentionRisqueIds,
        List<Integer> prudenceIds,

        // Business rule: at least one examen is required
        @NotEmpty(message = "At least one examen (code_demande) must be provided")
        List<String> examens,

        List<String> automates

) {}