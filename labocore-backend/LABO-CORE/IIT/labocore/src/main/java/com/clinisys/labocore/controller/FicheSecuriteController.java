package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.FicheSecuriteDto;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.service.FicheSecuriteService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk-conditions")
public class FicheSecuriteController {

    private final FicheSecuriteService service;

    public FicheSecuriteController(FicheSecuriteService service) {
        this.service = service;
    }

    @GetMapping
    public PagedResponse<FicheSecuriteDto> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return service.list(page, size, search);
    }

    @GetMapping("/{id}")
    public FicheSecuriteDto getOne(@PathVariable Integer id) {
        return service.getOne(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FicheSecuriteDto create(@RequestBody FicheSecuriteDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public FicheSecuriteDto update(@PathVariable Integer id, @RequestBody FicheSecuriteDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
