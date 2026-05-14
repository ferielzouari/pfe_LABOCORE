package com.clinisys.labocore.dto;

public record DemandeAnalyseDto(
    String codeDemande,
    String designation,
    String designationAnglais,
    String codeFamille,
    Integer type,
    Integer nbrAnalyseConst,
    Boolean actif,
    Integer numOrdreExam
) {}
