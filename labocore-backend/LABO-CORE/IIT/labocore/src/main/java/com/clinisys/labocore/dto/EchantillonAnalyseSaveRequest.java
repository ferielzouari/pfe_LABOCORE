package com.clinisys.labocore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EchantillonAnalyseSaveRequest(
        @NotNull Long echantillonId,
        @NotBlank String codeDemande,
        String statut
) {}
