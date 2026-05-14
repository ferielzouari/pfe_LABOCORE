package com.clinisys.labocore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record BonReceptionLigneRequest(
        @NotBlank(message = "Article code is required")
        String codart,
        String desart,
        String numLot,
        LocalDateTime datePeremption,
        @NotNull(message = "Quantity ordered is required")
        Double qteCmd,
        Double qteRec
) {}
