package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.Echantillon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EchantillonRepository extends JpaRepository<Echantillon, Long> {

    @Query("""
            SELECT e FROM Echantillon e
            WHERE (:search = '' OR LOWER(e.sampleId) LIKE LOWER(CONCAT('%', :search, '%'))
                               OR LOWER(e.patientId) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:status = '' OR e.status = :status)
            """)
    Page<Echantillon> search(
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable
    );

    @Query("SELECT MAX(e.id) FROM Echantillon e")
    Long findMaxId();

    List<Echantillon> findTop10ByStatusOrderByCollectedAtDesc(String status);
}