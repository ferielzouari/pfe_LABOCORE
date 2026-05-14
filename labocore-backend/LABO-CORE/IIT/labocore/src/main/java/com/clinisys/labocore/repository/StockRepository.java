package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.StockEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<StockEntity, String> {

    @Query("SELECT s FROM StockEntity s WHERE (:famArt = '' OR s.famArt = :famArt) AND (:search = '' OR LOWER(s.codart) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.desart) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<StockEntity> search(@Param("search") String search, @Param("famArt") String famArt, Pageable pageable);
}
