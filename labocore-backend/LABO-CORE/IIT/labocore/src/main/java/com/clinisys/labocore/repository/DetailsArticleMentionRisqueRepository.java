package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.DetailsArticleMentionRisque;
import com.clinisys.labocore.entity.DetailsArticleMentionRisqueId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DetailsArticleMentionRisqueRepository
        extends JpaRepository<DetailsArticleMentionRisque, DetailsArticleMentionRisqueId> {

    @Modifying
    @Query("DELETE FROM DetailsArticleMentionRisque d WHERE d.id.codeArticle = :codeArticle")
    void deleteByCodeArticle(@Param("codeArticle") String codeArticle);
}