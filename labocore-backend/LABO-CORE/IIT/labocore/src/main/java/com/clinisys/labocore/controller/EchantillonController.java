package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.EchantillonDto;
import com.clinisys.labocore.dto.EchantillonSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.service.EchantillonService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/samples")
public class EchantillonController {

    private final EchantillonService service;

    public EchantillonController(EchantillonService service) {
        this.service = service;
    }

    /** GET /api/samples?page=1&size=20&search=&status= */
    @GetMapping
    public ResponseEntity<PagedResponse<EchantillonDto>> list(
            @RequestParam(defaultValue = "1")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(defaultValue = "")   String search,
            @RequestParam(defaultValue = "")   String status
    ) {
        return ResponseEntity.ok(service.listEchantillons(page, size, search, status));
    }

    /** GET /api/samples/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<EchantillonDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(service.getEchantillon(id));
    }

    /** POST /api/samples */
    @PostMapping
    public ResponseEntity<EchantillonDto> create(
            @Valid @RequestBody EchantillonSaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createEchantillon(request));
    }

    /** PATCH /api/samples/{id}/status */
    @PatchMapping("/{id}/status")
    public ResponseEntity<EchantillonDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateStatus(id, body.get("status")));
    }

    /** DELETE /api/samples/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteEchantillon(id);
        return ResponseEntity.noContent().build();
    }
}