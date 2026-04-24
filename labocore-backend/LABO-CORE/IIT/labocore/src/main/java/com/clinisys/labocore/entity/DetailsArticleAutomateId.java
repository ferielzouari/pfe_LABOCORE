package com.clinisys.labocore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DetailsArticleAutomateId implements Serializable {

    @Column(name = "code_article", length = 300)
    private String codeArticle;

    @Column(name = "code_automate", length = 300)
    private String codeAutomate;

    public DetailsArticleAutomateId() {}

    public DetailsArticleAutomateId(String codeArticle, String codeAutomate) {
        this.codeArticle  = codeArticle;
        this.codeAutomate = codeAutomate;
    }

    public String getCodeArticle() { return codeArticle; }
    public void setCodeArticle(String codeArticle) { this.codeArticle = codeArticle; }

    public String getCodeAutomate() { return codeAutomate; }
    public void setCodeAutomate(String codeAutomate) { this.codeAutomate = codeAutomate; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DetailsArticleAutomateId that)) return false;
        return Objects.equals(codeArticle, that.codeArticle) &&
                Objects.equals(codeAutomate, that.codeAutomate);
    }

    @Override
    public int hashCode() { return Objects.hash(codeArticle, codeAutomate); }
}