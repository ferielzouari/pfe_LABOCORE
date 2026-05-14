package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.FicheSecurite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FicheSecuriteRepository extends JpaRepository<FicheSecurite, Integer> {

    @Query("SELECT f FROM FicheSecurite f WHERE (:search = '' OR LOWER(f.code) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.designation) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<FicheSecurite> search(@Param("search") String search, Pageable pageable);
}
