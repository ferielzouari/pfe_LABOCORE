package com.clinisys.labocore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DetailsArticlePrudenceId implements Serializable {

    @Column(name = "code_article", length = 300)
    private String codeArticle;

    @Column(name = "id_prudence")
    private Integer idPrudence;

    public DetailsArticlePrudenceId() {}

    public DetailsArticlePrudenceId(String codeArticle, Integer idPrudence) {
        this.codeArticle = codeArticle;
        this.idPrudence  = idPrudence;
    }

    public String getCodeArticle() { return codeArticle; }
    public void setCodeArticle(String codeArticle) { this.codeArticle = codeArticle; }

    public Integer getIdPrudence() { return idPrudence; }
    public void setIdPrudence(Integer idPrudence) { this.idPrudence = idPrudence; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DetailsArticlePrudenceId that)) return false;
        return Objects.equals(codeArticle, that.codeArticle) &&
                Objects.equals(idPrudence, that.idPrudence);
    }

    @Override
    public int hashCode() { return Objects.hash(codeArticle, idPrudence); }
}