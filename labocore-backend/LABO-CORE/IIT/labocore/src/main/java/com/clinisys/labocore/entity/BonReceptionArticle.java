package com.clinisys.labocore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "BonReceptionArticle", schema = "dbo")
public class BonReceptionArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numBon", nullable = false, length = 50)
    private String numBon;

    @Column(name = "codart", nullable = false, length = 50)
    private String codart;

    @Column(name = "desart", length = 200)
    private String desart;

    @Column(name = "numLot", length = 50)
    private String numLot;

    @Column(name = "datePeremption")
    private LocalDateTime datePeremption;

    @Column(name = "qteCmd")
    private Double qteCmd;

    @Column(name = "qteRec")
    private Double qteRec;

    public BonReceptionArticle() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumBon() { return numBon; }
    public void setNumBon(String numBon) { this.numBon = numBon; }

    public String getCodart() { return codart; }
    public void setCodart(String codart) { this.codart = codart; }

    public String getDesart() { return desart; }
    public void setDesart(String desart) { this.desart = desart; }

    public String getNumLot() { return numLot; }
    public void setNumLot(String numLot) { this.numLot = numLot; }

    public LocalDateTime getDatePeremption() { return datePeremption; }
    public void setDatePeremption(LocalDateTime datePeremption) { this.datePeremption = datePeremption; }

    public Double getQteCmd() { return qteCmd; }
    public void setQteCmd(Double qteCmd) { this.qteCmd = qteCmd; }

    public Double getQteRec() { return qteRec; }
    public void setQteRec(Double qteRec) { this.qteRec = qteRec; }
}
