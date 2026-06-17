package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.MouvementStockDto;
import com.clinisys.labocore.dto.MouvementStockSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.service.MouvementStockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mouvements")
public class MouvementStockController {

    private final MouvementStockService service;

    public MouvementStockController(MouvementStockService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<MouvementStockDto>> list(
            @RequestParam(defaultValue = "1")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(defaultValue = "")   String codart,
            @RequestParam(defaultValue = "")   String type
    ) {
        return ResponseEntity.ok(service.list(page, size, codart, type));
    }

    @PostMapping
    public ResponseEntity<MouvementStockDto> create(
            @Valid @RequestBody MouvementStockSaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
