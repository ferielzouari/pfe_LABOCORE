package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.FicheSecuriteDto;
import com.clinisys.labocore.dto.PagedResponse;

public interface FicheSecuriteService {
    PagedResponse<FicheSecuriteDto> list(int page, int size, String search);
    FicheSecuriteDto getOne(Integer id);
    FicheSecuriteDto create(FicheSecuriteDto dto);
    FicheSecuriteDto update(Integer id, FicheSecuriteDto dto);
    void delete(Integer id);
}
