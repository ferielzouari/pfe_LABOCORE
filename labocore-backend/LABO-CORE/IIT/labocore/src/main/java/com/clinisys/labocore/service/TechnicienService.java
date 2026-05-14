package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.dto.TechnicienDto;
import com.clinisys.labocore.dto.TechnicienSaveRequest;

import java.util.List;

public interface TechnicienService {
    PagedResponse<TechnicienDto> list(int page, int size, String search, String service);
    TechnicienDto getOne(Long id);
    TechnicienDto create(TechnicienSaveRequest request);
    TechnicienDto update(Long id, TechnicienSaveRequest request);
    void delete(Long id);
    List<String> getServices();
}
