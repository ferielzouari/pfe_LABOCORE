package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.Technicien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TechnicienRepository extends JpaRepository<Technicien, Long> {

    @Query("""
        SELECT t FROM Technicien t
        WHERE (:search = '' OR LOWER(t.matricule) LIKE LOWER(CONCAT('%',:search,'%'))
                           OR LOWER(t.nom) LIKE LOWER(CONCAT('%',:search,'%'))
                           OR LOWER(t.prenom) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:service = '' OR t.service = :service)
        ORDER BY t.nom ASC
        """)
    Page<Technicien> search(
        @Param("search") String search,
        @Param("service") String service,
        Pageable pageable
    );

    @Query("SELECT DISTINCT t.service FROM Technicien t WHERE t.service IS NOT NULL ORDER BY t.service")
    List<String> findDistinctServices();

    Optional<Technicien> findByMatricule(String matricule);
}
