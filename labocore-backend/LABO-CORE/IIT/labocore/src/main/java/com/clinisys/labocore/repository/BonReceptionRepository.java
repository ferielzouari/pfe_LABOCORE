package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.BonReception;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BonReceptionRepository extends JpaRepository<BonReception, Long> {

    @Query("SELECT b FROM BonReception b WHERE (:search = '' OR LOWER(b.numBon) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(b.codFrs) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<BonReception> search(@Param("search") String search, Pageable pageable);

    Optional<BonReception> findByNumBon(String numBon);

    @Query("SELECT MAX(b.numBon) FROM BonReception b WHERE b.numBon LIKE :prefix")
    String findMaxNumBon(@Param("prefix") String prefix);
}
