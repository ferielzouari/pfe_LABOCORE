package com.clinisys.labocore.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record TechnicienSaveRequest(
    @NotBlank(message = "Matricule is required")
    String matricule,
    @NotBlank(message = "Nom is required")
    String nom,
    @NotBlank(message = "Prenom is required")
    String prenom,
    String specialite,
    String telephone,
    String email,
    String service,
    LocalDate dateEntree
) {}
