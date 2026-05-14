package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.dto.StockDto;
import com.clinisys.labocore.service.StockService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    @GetMapping
    public PagedResponse<StockDto> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String famArt) {
        return service.list(page, size, search, famArt);
    }
}
