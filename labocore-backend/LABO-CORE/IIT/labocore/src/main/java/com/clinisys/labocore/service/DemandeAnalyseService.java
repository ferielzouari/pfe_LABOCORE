package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.DemandeAnalyseDto;
import com.clinisys.labocore.dto.PagedResponse;

import java.util.List;

public interface DemandeAnalyseService {
    PagedResponse<DemandeAnalyseDto> list(int page, int size, String search, String famille, Boolean actif);
    List<String> getFamilies();
}
