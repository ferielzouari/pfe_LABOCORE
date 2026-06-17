package com.clinisys.labocore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Echantillon_Analyse", schema = "dbo")
public class EchantillonAnalyse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "echantillon_id", nullable = false)
    private Long echantillonId;

    @Column(name = "code_demande", nullable = false, length = 10)
    private String codeDemande;

    @Column(name = "statut", nullable = false, length = 20)
    private String statut;

    @Column(name = "resultat", length = 500)
    private String resultat;

    @Column(name = "date_assignation", nullable = false)
    private LocalDateTime dateAssignation;

    @PrePersist
    public void prePersist() {
        if (statut == null) {
            statut = "En attente";
        }
        if (dateAssignation == null) {
            dateAssignation = LocalDateTime.now();
        }
    }

    public EchantillonAnalyse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getEchantillonId() { return echantillonId; }
    public void setEchantillonId(Long echantillonId) { this.echantillonId = echantillonId; }
    public String getCodeDemande() { return codeDemande; }
    public void setCodeDemande(String codeDemande) { this.codeDemande = codeDemande; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getResultat() { return resultat; }
    public void setResultat(String resultat) { this.resultat = resultat; }
    public LocalDateTime getDateAssignation() { return dateAssignation; }
    public void setDateAssignation(LocalDateTime dateAssignation) { this.dateAssignation = dateAssignation; }
}
