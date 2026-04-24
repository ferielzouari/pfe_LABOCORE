package com.clinisys.labocore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "details_article_examen") //schema = "dbo")
public class DetailsArticleExamen {

    @EmbeddedId
    private DetailsArticleExamenId id;

    public DetailsArticleExamen() {}

    public DetailsArticleExamen(String codeArticle, String codeDemande) {
        this.id = new DetailsArticleExamenId(codeArticle, codeDemande);
    }

    public DetailsArticleExamenId getId() { return id; }
    public void setId(DetailsArticleExamenId id) { this.id = id; }
}