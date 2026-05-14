package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.DemandeAnalyse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DemandeAnalyseRepository extends JpaRepository<DemandeAnalyse, String> {

    @Query("""
        SELECT d FROM DemandeAnalyse d
        WHERE (:search = '' OR LOWER(d.codeDemande) LIKE LOWER(CONCAT('%',:search,'%'))
                           OR LOWER(d.designation) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:famille = '' OR d.codeFamille = :famille)
          AND (:actif IS NULL OR d.actif = :actif)
        ORDER BY d.numOrdreExam ASC
        """)
    Page<DemandeAnalyse> search(
        @Param("search") String search,
        @Param("famille") String famille,
        @Param("actif") Boolean actif,
        Pageable pageable
    );

    @Query("SELECT DISTINCT d.codeFamille FROM DemandeAnalyse d WHERE d.codeFamille IS NOT NULL ORDER BY d.codeFamille")
    List<String> findDistinctFamilles();
}
