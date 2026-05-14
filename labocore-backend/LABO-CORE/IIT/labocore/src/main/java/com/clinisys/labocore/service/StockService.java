package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.dto.StockDto;

public interface StockService {
    PagedResponse<StockDto> list(int page, int size, String search, String famArt);
}
