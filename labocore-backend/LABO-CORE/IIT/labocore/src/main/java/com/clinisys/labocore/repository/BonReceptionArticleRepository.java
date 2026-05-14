package com.clinisys.labocore.repository;

import com.clinisys.labocore.entity.BonReceptionArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BonReceptionArticleRepository extends JpaRepository<BonReceptionArticle, Long> {
    List<BonReceptionArticle> findByNumBon(String numBon);
    void deleteByNumBon(String numBon);
}
