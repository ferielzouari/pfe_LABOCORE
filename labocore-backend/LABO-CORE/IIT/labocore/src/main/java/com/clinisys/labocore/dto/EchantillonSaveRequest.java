package com.clinisys.labocore.dto;

import jakarta.validation.constraints.NotBlank;

public record EchantillonSaveRequest(
        @NotBlank String patientId,
        @NotBlank String type,
        @NotBlank String priority,
        String notes
) {}