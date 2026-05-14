package com.clinisys.labocore.dto;

import jakarta.validation.constraints.NotBlank;

public record FournisseurSaveRequest(
        @NotBlank(message = "Code is required")
        String code,
        @NotBlank(message = "Raison Sociale is required")
        String raisonSociale,
        String telephone,
        String email,
        String adresse
) {}
