package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.FicheArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FicheArticleRepository extends JpaRepository<FicheArticle, String> {

    @Query("""
            SELECT f FROM FicheArticle f
            WHERE (:code = '' OR LOWER(f.codeArticle) LIKE LOWER(CONCAT('%', :code, '%')))
              AND (:designation = '' OR LOWER(f.designationFr) LIKE LOWER(CONCAT('%', :designation, '%')))
            """)
    Page<FicheArticle> search(
            @Param("code")        String code,
            @Param("designation") String designation,
            Pageable pageable
    );
}