package com.clinisys.labocore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DetailsArticleFicheSecuriteId implements Serializable {

    @Column(name = "code_article", length = 300)
    private String codeArticle;

    @Column(name = "id_securite")
    private Integer idSecurite;

    public DetailsArticleFicheSecuriteId() {}

    public DetailsArticleFicheSecuriteId(String codeArticle, Integer idSecurite) {
        this.codeArticle = codeArticle;
        this.idSecurite  = idSecurite;
    }

    public String getCodeArticle() { return codeArticle; }
    public void setCodeArticle(String codeArticle) { this.codeArticle = codeArticle; }

    public Integer getIdSecurite() { return idSecurite; }
    public void setIdSecurite(Integer idSecurite) { this.idSecurite = idSecurite; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DetailsArticleFicheSecuriteId that)) return false;
        return Objects.equals(codeArticle, that.codeArticle) &&
                Objects.equals(idSecurite, that.idSecurite);
    }

    @Override
    public int hashCode() { return Objects.hash(codeArticle, idSecurite); }
}