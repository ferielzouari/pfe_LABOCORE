package com.clinisys.labocore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "MouvementStock", schema = "dbo")
public class MouvementStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "codart", nullable = false, length = 300)
    private String codart;

    @Column(name = "type_mouvement", nullable = false, length = 20)
    private String typeMouvement;

    @Column(name = "quantite", nullable = false, precision = 18, scale = 3)
    private BigDecimal quantite;

    @Column(name = "num_lot", length = 100)
    private String numLot;

    @Column(name = "date_peremption")
    private LocalDateTime datePeremption;

    @Column(name = "date_mouvement", nullable = false)
    private LocalDateTime dateMouvement;

    @Column(name = "motif", length = 300)
    private String motif;

    @Column(name = "utilisateur", length = 100)
    private String utilisateur;

    @PrePersist
    public void prePersist() {
        if (dateMouvement == null) {
            dateMouvement = LocalDateTime.now();
        }
    }

    public MouvementStock() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodart() { return codart; }
    public void setCodart(String codart) { this.codart = codart; }
    public String getTypeMouvement() { return typeMouvement; }
    public void setTypeMouvement(String typeMouvement) { this.typeMouvement = typeMouvement; }
    public BigDecimal getQuantite() { return quantite; }
    public void setQuantite(BigDecimal quantite) { this.quantite = quantite; }
    public String getNumLot() { return numLot; }
    public void setNumLot(String numLot) { this.numLot = numLot; }
    public LocalDateTime getDatePeremption() { return datePeremption; }
    public void setDatePeremption(LocalDateTime datePeremption) { this.datePeremption = datePeremption; }
    public LocalDateTime getDateMouvement() { return dateMouvement; }
    public void setDateMouvement(LocalDateTime dateMouvement) { this.dateMouvement = dateMouvement; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public String getUtilisateur() { return utilisateur; }
    public void setUtilisateur(String utilisateur) { this.utilisateur = utilisateur; }
}
