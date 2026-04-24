package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.DetailsArticleExamen;
import com.clinisys.labocore.entity.DetailsArticleExamenId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DetailsArticleExamenRepository
        extends JpaRepository<DetailsArticleExamen, DetailsArticleExamenId> {

    @Modifying
    @Query("DELETE FROM DetailsArticleExamen d WHERE d.id.codeArticle = :codeArticle")
    void deleteByCodeArticle(@Param("codeArticle") String codeArticle);

    @Query("SELECT d.id.codeDemande FROM DetailsArticleExamen d WHERE d.id.codeArticle = :codeArticle")
    List<String> findCodeDemandeByCodeArticle(@Param("codeArticle") String codeArticle);
}