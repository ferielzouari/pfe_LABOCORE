package com.clinisys.labocore.dto;

import java.time.LocalDateTime;

public record BonReceptionDto(
        Long id,
        String numBon,
        LocalDateTime dateBon,
        String codFrs,
        String raisonSociale,
        String depot,
        Long nbArticles
) {}
