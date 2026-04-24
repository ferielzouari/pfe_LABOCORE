package com.clinisys.labocore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "details_article_prudence") //schema = "dbo")
public class DetailsArticlePrudence {

    @EmbeddedId
    private DetailsArticlePrudenceId id;

    public DetailsArticlePrudence() {}

    public DetailsArticlePrudence(String codeArticle, Integer idPrudence) {
        this.id = new DetailsArticlePrudenceId(codeArticle, idPrudence);
    }

    public DetailsArticlePrudenceId getId() { return id; }
    public void setId(DetailsArticlePrudenceId id) { this.id = id; }
}