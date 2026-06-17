package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.EchantillonAnalyseDto;
import com.clinisys.labocore.dto.EchantillonAnalyseSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.service.EchantillonAnalyseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/echantillon-analyses")
public class EchantillonAnalyseController {

    private final EchantillonAnalyseService service;

    public EchantillonAnalyseController(EchantillonAnalyseService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<EchantillonAnalyseDto>> list(
            @RequestParam(defaultValue = "1")  int    page,
            @RequestParam(defaultValue = "20") int    size,
            @RequestParam(required = false)    Long   echantillonId,
            @RequestParam(defaultValue = "")   String statut
    ) {
        return ResponseEntity.ok(service.list(page, size, echantillonId, statut));
    }

    @GetMapping("/sample/{echantillonId}")
    public ResponseEntity<List<EchantillonAnalyseDto>> getBySample(
            @PathVariable Long echantillonId) {
        return ResponseEntity.ok(service.getByEchantillon(echantillonId));
    }

    @PostMapping
    public ResponseEntity<EchantillonAnalyseDto> create(
            @Valid @RequestBody EchantillonAnalyseSaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<EchantillonAnalyseDto> updateStatut(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                service.updateStatut(id, body.get("statut"), body.get("resultat")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
