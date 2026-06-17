package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.BonReceptionArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BonReceptionArticleRepository extends JpaRepository<BonReceptionArticle, Long> {
    List<BonReceptionArticle> findByNumBon(String numBon);
    void deleteByNumBon(String numBon);

    @Query("SELECT b FROM BonReceptionArticle b WHERE b.codart = :codart ORDER BY b.id DESC")
    List<BonReceptionArticle> findByCodartOrderByIdDesc(@Param("codart") String codart);
}
