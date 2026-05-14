package com.clinisys.labocore.dto;

import java.time.LocalDateTime;

public record EchantillonDto(
        Long id,
        String sampleId,
        String patientId,
        String type,
        String priority,
        LocalDateTime collectedAt,
        String status,
        String notes
) {}