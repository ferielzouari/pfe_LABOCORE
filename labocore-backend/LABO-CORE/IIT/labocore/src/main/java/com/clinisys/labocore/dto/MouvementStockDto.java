package com.clinisys.labocore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MouvementStockDto(
        Long id,
        String codart,
        String typeMouvement,
        BigDecimal quantite,
        String numLot,
        LocalDateTime datePeremption,
        LocalDateTime dateMouvement,
        String motif,
        String utilisateur
) {}
