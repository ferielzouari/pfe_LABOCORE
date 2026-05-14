package com.clinisys.labocore.dto;

public record FournisseurDto(
        Long id,
        String code,
        String raisonSociale,
        String telephone,
        String email,
        String adresse,
        Boolean actif
) {}
