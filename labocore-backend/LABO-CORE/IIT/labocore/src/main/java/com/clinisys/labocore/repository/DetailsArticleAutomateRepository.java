package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.DetailsArticleAutomate;
import com.clinisys.labocore.entity.DetailsArticleAutomateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DetailsArticleAutomateRepository
        extends JpaRepository<DetailsArticleAutomate, DetailsArticleAutomateId> {

    @Modifying
    @Query("DELETE FROM DetailsArticleAutomate d WHERE d.id.codeArticle = :codeArticle")
    void deleteByCodeArticle(@Param("codeArticle") String codeArticle);

    @Query("SELECT d.id.codeAutomate FROM DetailsArticleAutomate d WHERE d.id.codeArticle = :codeArticle")
    List<String> findCodeAutomateByCodeArticle(@Param("codeArticle") String codeArticle);
}