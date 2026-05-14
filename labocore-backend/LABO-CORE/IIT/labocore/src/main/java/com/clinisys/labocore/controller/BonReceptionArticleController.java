package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.BonReceptionArticleDto;
import com.clinisys.labocore.dto.BonReceptionDto;
import com.clinisys.labocore.dto.BonReceptionSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.service.BonReceptionArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
     * Returns paginated list of all lines (BonReceptionArticle join BonReception)
     */
    @GetMapping
    public ResponseEntity<PagedResponse<BonReceptionArticleDto>> findAll(
            @RequestParam(defaultValue = "1")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "")   String search
    ) {
        return ResponseEntity.ok(service.findAll(page, size, search));
    }

    /**
     * GET /api/bon-reception-articles/list?page=1&size=20&search=
     * Returns paginated list of headers (BonReception)
     */
    @GetMapping("/list")
    public ResponseEntity<PagedResponse<BonReceptionDto>> listBons(
            @RequestParam(defaultValue = "1")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "")   String search
    ) {
        return ResponseEntity.ok(service.listBons(page, size, search));
    }

    @GetMapping("/{numBon}")
    public ResponseEntity<BonReceptionDto> getOne(@PathVariable String numBon) {
        return ResponseEntity.ok(service.getOne(numBon));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<BonReceptionDto> create(@Valid @RequestBody BonReceptionSaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @DeleteMapping("/{numBon}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> delete(@PathVariable String numBon) {
        service.delete(numBon);
        return ResponseEntity.noContent().build();
    }
}