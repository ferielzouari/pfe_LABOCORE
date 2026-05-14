package com.clinisys.labocore.dto;

import java.time.LocalDate;

public record TechnicienDto(
    Long id,
    String matricule,
    String nom,
    String prenom,
    String specialite,
    String telephone,
    String email,
    String service,
    Boolean actif,
    LocalDate dateEntree
) {}
