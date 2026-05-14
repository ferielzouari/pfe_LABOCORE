package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.Fournisseur;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {

    @Query("SELECT f FROM Fournisseur f WHERE (:search = '' OR LOWER(f.code) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.raisonSociale) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Fournisseur> search(@Param("search") String search, Pageable pageable);

    Optional<Fournisseur> findByCode(String code);
}
