package com.clinisys.labocore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "Stock", schema = "dbo")
public class StockEntity {

    @Id
    @Column(name = "codart")
    private String codart;

    @Column(name = "desart")
    private String desart;

    @Column(name = "Unimes")
    private String unimes;

    @Column(name = "StkDep")
    private BigDecimal stkDep;

    @Column(name = "StkMin")
    private BigDecimal stkMin;

    @Column(name = "StkMax")
    private BigDecimal stkMax;

    @Column(name = "FamArt")
    private String famArt;

    @Column(name = "actif")
    private Boolean actif;

    @Column(name = "parametrer_labo")
    private Boolean parametrerLabo;

    public StockEntity() {}

    public String getCodart() { return codart; }
    public void setCodart(String codart) { this.codart = codart; }

    public String getDesart() { return desart; }
    public void setDesart(String desart) { this.desart = desart; }

    public String getUnimes() { return unimes; }
    public void setUnimes(String unimes) { this.unimes = unimes; }

    public BigDecimal getStkDep() { return stkDep; }
    public void setStkDep(BigDecimal stkDep) { this.stkDep = stkDep; }

    public BigDecimal getStkMin() { return stkMin; }
    public void setStkMin(BigDecimal stkMin) { this.stkMin = stkMin; }

    public BigDecimal getStkMax() { return stkMax; }
    public void setStkMax(BigDecimal stkMax) { this.stkMax = stkMax; }

    public String getFamArt() { return famArt; }
    public void setFamArt(String famArt) { this.famArt = famArt; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public Boolean getParametrerLabo() { return parametrerLabo; }
    public void setParametrerLabo(Boolean parametrerLabo) { this.parametrerLabo = parametrerLabo; }
}
