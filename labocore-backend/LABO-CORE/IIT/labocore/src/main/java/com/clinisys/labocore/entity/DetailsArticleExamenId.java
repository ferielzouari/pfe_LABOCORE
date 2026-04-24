package com.clinisys.labocore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DetailsArticleExamenId implements Serializable {

    @Column(name = "code_article", length = 300)
    private String codeArticle;

    @Column(name = "code_demande", length = 300)
    private String codeDemande;

    public DetailsArticleExamenId() {}

    public DetailsArticleExamenId(String codeArticle, String codeDemande) {
        this.codeArticle = codeArticle;
        this.codeDemande = codeDemande;
    }

    public String getCodeArticle() { return codeArticle; }
    public void setCodeArticle(String codeArticle) { this.codeArticle = codeArticle; }

    public String getCodeDemande() { return codeDemande; }
    public void setCodeDemande(String codeDemande) { this.codeDemande = codeDemande; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DetailsArticleExamenId that)) return false;
        return Objects.equals(codeArticle, that.codeArticle) &&
                Objects.equals(codeDemande, that.codeDemande);
    }

    @Override
    public int hashCode() { return Objects.hash(codeArticle, codeDemande); }
}