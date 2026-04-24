package com.clinisys.labocore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "details_article_mention_risque") //schema = "dbo")
public class DetailsArticleMentionRisque {

    @EmbeddedId
    private DetailsArticleMentionRisqueId id;

    public DetailsArticleMentionRisque() {}

    public DetailsArticleMentionRisque(String codeArticle, Integer idMention) {
        this.id = new DetailsArticleMentionRisqueId(codeArticle, idMention);
    }

    public DetailsArticleMentionRisqueId getId() { return id; }
    public void setId(DetailsArticleMentionRisqueId id) { this.id = id; }
}