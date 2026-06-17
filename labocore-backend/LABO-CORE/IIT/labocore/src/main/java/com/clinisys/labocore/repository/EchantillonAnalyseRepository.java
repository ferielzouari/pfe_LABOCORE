package com.clinisys.labocore.repository;
import com.clinisys.labocore.entity.EchantillonAnalyse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface EchantillonAnalyseRepository extends JpaRepository<EchantillonAnalyse, Long> {
    List<EchantillonAnalyse> findByEchantillonId(Long echantillonId);
    void deleteByEchantillonId(Long echantillonId);
    Page<EchantillonAnalyse> findAll(Pageable pageable);
}
