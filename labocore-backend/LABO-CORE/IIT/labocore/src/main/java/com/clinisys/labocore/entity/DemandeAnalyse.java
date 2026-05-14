package com.clinisys.labocore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Demande_Analyse", schema = "dbo")
public class DemandeAnalyse {

    @Id
    @Column(name = "Code_Demande")
    private String codeDemande;

    @Column(name = "Designation")
    private String designation;

    @Column(name = "DesignationAnglais")
    private String designationAnglais;

    @Column(name = "Code_Famille")
    private String codeFamille;

    @Column(name = "Type")
    private Integer type;

    @Column(name = "NbrAnalyseConst")
    private Integer nbrAnalyseConst;

    @Column(name = "actif")
    private Boolean actif;

    @Column(name = "NumOrdreExam")
    private Integer numOrdreExam;

    public DemandeAnalyse() {}

    public String getCodeDemande() { return codeDemande; }
    public void setCodeDemande(String codeDemande) { this.codeDemande = codeDemande; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getDesignationAnglais() { return designationAnglais; }
    public void setDesignationAnglais(String designationAnglais) { this.designationAnglais = designationAnglais; }

    public String getCodeFamille() { return codeFamille; }
    public void setCodeFamille(String codeFamille) { this.codeFamille = codeFamille; }

    public Integer getType() { return type; }
    public void setType(Integer type) { this.type = type; }

    public Integer getNbrAnalyseConst() { return nbrAnalyseConst; }
    public void setNbrAnalyseConst(Integer nbrAnalyseConst) { this.nbrAnalyseConst = nbrAnalyseConst; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public Integer getNumOrdreExam() { return numOrdreExam; }
    public void setNumOrdreExam(Integer numOrdreExam) { this.numOrdreExam = numOrdreExam; }
}
