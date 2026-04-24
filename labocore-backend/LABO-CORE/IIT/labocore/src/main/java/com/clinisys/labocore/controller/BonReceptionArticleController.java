package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.BonReceptionArticleDto;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.service.BonReceptionArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bon-reception-articles")
public class BonReceptionArticleController {

    private final BonReceptionArticleService service;

    public BonReceptionArticleController(BonReceptionArticleService service) {
        this.service = service;
    }

    /**
     * GET /api/bon-reception-articles?page=1&size=20&search=
     */
    @GetMapping
    public ResponseEntity<PagedResponse<BonReceptionArticleDto>> findAll(
            @RequestParam(defaultValue = "1")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "")   String search
    ) {
        return ResponseEntity.ok(service.findAll(page, size, search));
    }
}