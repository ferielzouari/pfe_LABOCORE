package com.clinisys.labocore.dto;

import java.time.LocalDateTime;

public record BonReceptionArticleDto(
        String numbon,
        LocalDateTime datbon,
        String codfrs,
        String raiSoc,
        String codart,
        String desart,
        Double quantite,
        Double receptionnerLabo,
        Double parameterLabo,
        Integer coddep
) {}