package com.clinisys.labocore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "details_article_fiche_securite") //schema = "dbo")
public class DetailsArticleFicheSecurite {

    @EmbeddedId
    private DetailsArticleFicheSecuriteId id;

    public DetailsArticleFicheSecurite() {}

    public DetailsArticleFicheSecurite(String codeArticle, Integer idSecurite) {
        this.id = new DetailsArticleFicheSecuriteId(codeArticle, idSecurite);
    }

    public DetailsArticleFicheSecuriteId getId() { return id; }
    public void setId(DetailsArticleFicheSecuriteId id) { this.id = id; }
}