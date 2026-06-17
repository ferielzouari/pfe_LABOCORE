package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.EchantillonAnalyseDto;
import com.clinisys.labocore.dto.EchantillonAnalyseSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;

import java.util.List;

public interface EchantillonAnalyseService {

    PagedResponse<EchantillonAnalyseDto> list(int page, int size, Long echantillonId, String statut);

    List<EchantillonAnalyseDto> getByEchantillon(Long echantillonId);

    EchantillonAnalyseDto create(EchantillonAnalyseSaveRequest request);

    EchantillonAnalyseDto updateStatut(Long id, String statut, String resultat);

    void delete(Long id);
}
