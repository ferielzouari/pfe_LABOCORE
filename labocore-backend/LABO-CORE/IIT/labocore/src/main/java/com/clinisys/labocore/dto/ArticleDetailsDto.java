package com.clinisys.labocore.dto;

import java.util.List;

/**
 * Full read-only response returned by GET /api/articles/{codeArticle}
 * and included inside the paged list.
 */
public record ArticleDetailsDto(
        String codeArticle,
        String designationFr,
        String designationEn,
        String dureUtilisation,
        String uniteDure,
        String uom,
        String yieldValue,
        String unite,
        String precisionValue,
        String type,
        String modeGestion,
        String alerteAvant,
        List<Integer> ficheSecuriteIds,
        List<Integer> mentionRisqueIds,
        List<Integer> prudenceIds,
        List<String>  examens,
        List<String>  automates
) {}