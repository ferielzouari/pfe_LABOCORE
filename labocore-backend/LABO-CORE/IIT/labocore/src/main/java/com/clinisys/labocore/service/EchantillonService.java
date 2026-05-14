package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.EchantillonDto;
import com.clinisys.labocore.dto.EchantillonSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;

public interface EchantillonService {
    PagedResponse<EchantillonDto> listEchantillons(int page, int size, String search, String status);
    EchantillonDto getEchantillon(Long id);
    EchantillonDto createEchantillon(EchantillonSaveRequest request);
    EchantillonDto updateStatus(Long id, String status);
    void deleteEchantillon(Long id);
}