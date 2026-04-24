package com.clinisys.labocore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DetailsArticleMentionRisqueId implements Serializable {

    @Column(name = "code_article", length = 300)
    private String codeArticle;

    @Column(name = "id_mention")
    private Integer idMention;

    public DetailsArticleMentionRisqueId() {}

    public DetailsArticleMentionRisqueId(String codeArticle, Integer idMention) {
        this.codeArticle = codeArticle;
        this.idMention   = idMention;
    }

    public String getCodeArticle() { return codeArticle; }
    public void setCodeArticle(String codeArticle) { this.codeArticle = codeArticle; }

    public Integer getIdMention() { return idMention; }
    public void setIdMention(Integer idMention) { this.idMention = idMention; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DetailsArticleMentionRisqueId that)) return false;
        return Objects.equals(codeArticle, that.codeArticle) &&
                Objects.equals(idMention, that.idMention);
    }

    @Override
    public int hashCode() { return Objects.hash(codeArticle, idMention); }
}