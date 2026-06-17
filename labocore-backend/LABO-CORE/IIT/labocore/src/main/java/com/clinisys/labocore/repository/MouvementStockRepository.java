package com.clinisys.labocore.repository;
import com.clinisys.labocore.entity.MouvementStock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface MouvementStockRepository extends JpaRepository<MouvementStock, Long> {
    Page<MouvementStock> findAll(Pageable pageable);

    @Query("SELECT m FROM MouvementStock m WHERE (:codart = '' OR m.codart = :codart) AND (:typeMouvement = '' OR m.typeMouvement = :typeMouvement) ORDER BY m.dateMouvement DESC")
    List<MouvementStock> findRecent(@Param("codart") String codart, @Param("typeMouvement") String typeMouvement, Pageable pageable);
}
