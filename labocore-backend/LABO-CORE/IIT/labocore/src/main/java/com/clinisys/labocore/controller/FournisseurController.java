package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.FournisseurDto;
import com.clinisys.labocore.dto.FournisseurSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.service.FournisseurService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
public class FournisseurController {

    private final FournisseurService service;

    public FournisseurController(FournisseurService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<FournisseurDto>> findAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(service.findAll(page, size, search));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FournisseurDto>> findAllNoPagination() {
        return ResponseEntity.ok(service.findAllNoPagination());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FournisseurDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<FournisseurDto> create(@Valid @RequestBody FournisseurSaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FournisseurDto> update(@PathVariable Long id, @Valid @RequestBody FournisseurSaveRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
