package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.DemandeAnalyseDto;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.service.DemandeAnalyseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analyses")
public class DemandeAnalyseController {

    private final DemandeAnalyseService service;

    public DemandeAnalyseController(DemandeAnalyseService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<DemandeAnalyseDto>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String famille,
            @RequestParam(required = false) Boolean actif
    ) {
        return ResponseEntity.ok(service.list(page, size, search, famille, actif));
    }

    @GetMapping("/families")
    public ResponseEntity<List<String>> getFamilies() {
        return ResponseEntity.ok(service.getFamilies());
    }
}
