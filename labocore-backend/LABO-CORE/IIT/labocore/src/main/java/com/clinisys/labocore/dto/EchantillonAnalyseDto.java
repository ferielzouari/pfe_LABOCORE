package com.clinisys.labocore.dto;

import java.time.LocalDateTime;

public record EchantillonAnalyseDto(
        Long id,
        Long echantillonId,
        String sampleId,
        String patientId,
        String codeDemande,
        String designationAnalyse,
        String statut,
        String resultat,
        LocalDateTime dateAssignation
) {}
