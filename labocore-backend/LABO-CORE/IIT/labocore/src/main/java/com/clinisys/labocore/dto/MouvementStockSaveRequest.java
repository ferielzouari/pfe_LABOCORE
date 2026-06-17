package com.clinisys.labocore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MouvementStockSaveRequest(
        @NotBlank String codart,
        @NotBlank String typeMouvement,
        @NotNull BigDecimal quantite,
        String numLot,
        LocalDateTime datePeremption,
        String motif,
        String utilisateur
) {}
