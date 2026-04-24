package com.clinisys.labocore.entity;

import jakarta.persistence.*;

/**
 * Maps to dbo.Fiche_article
 * PK: code_article (String, assigned by caller — no auto-generation)
 */
@Entity
@Table(name = "Fiche_article") //schema = "dbo")
public class FicheArticle {

    @Id
    @Column(name = "code_article", nullable = false, length = 300)
    private String codeArticle;

    @Column(name = "Designation_fr", nullable = false, length = 400)
    private String designationFr;

    @Column(name = "Designation_En", nullable = false, length = 400)
    private String designationEn;

    @Column(name = "dure_utilisation", nullable = false, length = 10)
    private String dureUtilisation;

    @Column(name = "unite_dure", nullable = false, length = 10)
    private String uniteDure;

    @Column(name = "UOM", nullable = false, length = 10)
    private String uom;

    @Column(name = "yield", nullable = false, length = 10)
    private String yieldValue;

    @Column(name = "unite", nullable = false, length = 20)
    private String unite;

    @Column(name = "precision", nullable = false, length = 100)
    private String precisionValue;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "mode_gestion", nullable = false, length = 100)
    private String modeGestion;

    @Column(name = "alerte_avant", nullable = false, length = 4)
    private String alerteAvant;

    // ── Constructors ──────────────────────────────────────────────────────

    public FicheArticle() {}

    // ── Getters & Setters ─────────────────────────────────────────────────

    public String getCodeArticle() { return codeArticle; }
    public void setCodeArticle(String codeArticle) { this.codeArticle = codeArticle; }

    public String getDesignationFr() { return designationFr; }
    public void setDesignationFr(String designationFr) { this.designationFr = designationFr; }

    public String getDesignationEn() { return designationEn; }
    public void setDesignationEn(String designationEn) { this.designationEn = designationEn; }

    public String getDureUtilisation() { return dureUtilisation; }
    public void setDureUtilisation(String dureUtilisation) { this.dureUtilisation = dureUtilisation; }

    public String getUniteDure() { return uniteDure; }
    public void setUniteDure(String uniteDure) { this.uniteDure = uniteDure; }

    public String getUom() { return uom; }
    public void setUom(String uom) { this.uom = uom; }

    public String getYieldValue() { return yieldValue; }
    public void setYieldValue(String yieldValue) { this.yieldValue = yieldValue; }

    public String getUnite() { return unite; }
    public void setUnite(String unite) { this.unite = unite; }

    public String getPrecisionValue() { return precisionValue; }
    public void setPrecisionValue(String precisionValue) { this.precisionValue = precisionValue; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getModeGestion() { return modeGestion; }
    public void setModeGestion(String modeGestion) { this.modeGestion = modeGestion; }

    public String getAlerteAvant() { return alerteAvant; }
    public void setAlerteAvant(String alerteAvant) { this.alerteAvant = alerteAvant; }
}