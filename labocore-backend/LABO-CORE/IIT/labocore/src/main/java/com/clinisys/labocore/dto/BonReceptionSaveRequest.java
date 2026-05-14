package com.clinisys.labocore.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record BonReceptionSaveRequest(
        @NotBlank(message = "Supplier code is required")
        String codFrs,
        String depot,
        List<BonReceptionLigneRequest> lignes
) {}
