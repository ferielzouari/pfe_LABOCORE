package com.clinisys.labocore.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "details_article_automate") //schema = "dbo")
public class DetailsArticleAutomate {

    @EmbeddedId
    private DetailsArticleAutomateId id;

    public DetailsArticleAutomate() {
    }

    public DetailsArticleAutomate(String codeArticle, String codeAutomate) {
        this.id = new DetailsArticleAutomateId(codeArticle, codeAutomate);
    }

    public DetailsArticleAutomateId getId() {
        return id;
    }

    public void setId(DetailsArticleAutomateId id) {
        this.id = id;
    }
}