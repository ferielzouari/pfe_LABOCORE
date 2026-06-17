package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.MouvementStockDto;
import com.clinisys.labocore.dto.MouvementStockSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;

public interface MouvementStockService {

    PagedResponse<MouvementStockDto> list(int page, int size, String codart, String type);

    MouvementStockDto create(MouvementStockSaveRequest request);

    void delete(Long id);
}
