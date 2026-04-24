package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.DetailsArticlePrudence;
import com.clinisys.labocore.entity.DetailsArticlePrudenceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DetailsArticlePrudenceRepository
        extends JpaRepository<DetailsArticlePrudence, DetailsArticlePrudenceId> {

    @Modifying
    @Query("DELETE FROM DetailsArticlePrudence d WHERE d.id.codeArticle = :codeArticle")
    void deleteByCodeArticle(@Param("codeArticle") String codeArticle);
}