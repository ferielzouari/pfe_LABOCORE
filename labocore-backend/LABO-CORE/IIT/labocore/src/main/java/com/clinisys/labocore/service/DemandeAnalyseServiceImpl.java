package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.DemandeAnalyseDto;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.entity.DemandeAnalyse;
import com.clinisys.labocore.repository.DemandeAnalyseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandeAnalyseServiceImpl implements DemandeAnalyseService {

    private final DemandeAnalyseRepository repository;

    public DemandeAnalyseServiceImpl(DemandeAnalyseRepository repository) {
        this.repository = repository;
    }

    @Override
    public PagedResponse<DemandeAnalyseDto> list(int page, int size, String search, String famille, Boolean actif) {
        Page<DemandeAnalyse> result = repository.search(
                search == null ? "" : search,
                famille == null ? "" : famille,
                actif,
                PageRequest.of(page - 1, size)
        );

        List<DemandeAnalyseDto> dtos = result.getContent().stream()
                .map(this::toDto)
                .toList();

        return PagedResponse.of(dtos, page, size, result.getTotalElements());
    }

    @Override
    public List<String> getFamilies() {
        return repository.findDistinctFamilles();
    }

    private DemandeAnalyseDto toDto(DemandeAnalyse entity) {
        return new DemandeAnalyseDto(
                entity.getCodeDemande(),
                entity.getDesignation(),
                entity.getDesignationAnglais(),
                entity.getCodeFamille(),
                entity.getType(),
                entity.getNbrAnalyseConst(),
                entity.getActif(),
                entity.getNumOrdreExam()
        );
    }
}
