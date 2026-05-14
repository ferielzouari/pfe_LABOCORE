package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.FournisseurDto;
import com.clinisys.labocore.dto.FournisseurSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;

import java.util.List;

public interface FournisseurService {
    PagedResponse<FournisseurDto> findAll(int page, int size, String search);
    List<FournisseurDto> findAllNoPagination();
    FournisseurDto findById(Long id);
    FournisseurDto create(FournisseurSaveRequest request);
    FournisseurDto update(Long id, FournisseurSaveRequest request);
    void delete(Long id);
}
