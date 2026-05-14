package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.dto.TechnicienDto;
import com.clinisys.labocore.dto.TechnicienSaveRequest;
import com.clinisys.labocore.service.TechnicienService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/techniciens")
public class TechnicienController {

    private final TechnicienService service;

    public TechnicienController(TechnicienService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<TechnicienDto>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String service
    ) {
        return ResponseEntity.ok(this.service.list(page, size, search, service));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TechnicienDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(this.service.getOne(id));
    }

    @PostMapping
    public ResponseEntity<TechnicienDto> create(@Valid @RequestBody TechnicienSaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TechnicienDto> update(@PathVariable Long id, @Valid @RequestBody TechnicienSaveRequest request) {
        return ResponseEntity.ok(this.service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        this.service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/services")
    public ResponseEntity<List<String>> getServices() {
        return ResponseEntity.ok(this.service.getServices());
    }
}
