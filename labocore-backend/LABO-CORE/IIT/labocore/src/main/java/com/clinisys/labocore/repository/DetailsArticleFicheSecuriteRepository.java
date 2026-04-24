package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.DetailsArticleFicheSecurite;
import com.clinisys.labocore.entity.DetailsArticleFicheSecuriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DetailsArticleFicheSecuriteRepository
        extends JpaRepository<DetailsArticleFicheSecurite, DetailsArticleFicheSecuriteId> {

    @Modifying
    @Query("DELETE FROM DetailsArticleFicheSecurite d WHERE d.id.codeArticle = :codeArticle")
    void deleteByCodeArticle(@Param("codeArticle") String codeArticle);
}