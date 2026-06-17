package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.EchantillonAnalyseDto;
import com.clinisys.labocore.dto.EchantillonAnalyseSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.entity.DemandeAnalyse;
import com.clinisys.labocore.entity.Echantillon;
import com.clinisys.labocore.entity.EchantillonAnalyse;
import com.clinisys.labocore.exception.ResourceNotFoundException;
import com.clinisys.labocore.repository.DemandeAnalyseRepository;
import com.clinisys.labocore.repository.EchantillonAnalyseRepository;
import com.clinisys.labocore.repository.EchantillonRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class EchantillonAnalyseServiceImpl implements EchantillonAnalyseService {

    private final EchantillonAnalyseRepository repo;
    private final EchantillonRepository echantillonRepo;
    private final DemandeAnalyseRepository demandeRepo;

    public EchantillonAnalyseServiceImpl(
            EchantillonAnalyseRepository repo,
            EchantillonRepository echantillonRepo,
            DemandeAnalyseRepository demandeRepo) {
        this.repo = repo;
        this.echantillonRepo = echantillonRepo;
        this.demandeRepo = demandeRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<EchantillonAnalyseDto> list(int page, int size, Long echantillonId, String statut) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<EchantillonAnalyse> result = repo.findAll(pageable);

        List<EchantillonAnalyse> content = result.getContent();
        if (content.isEmpty()) {
            return PagedResponse.of(List.of(), page, size, 0);
        }

        Set<Long> echantillonIds = content.stream()
                .map(EchantillonAnalyse::getEchantillonId).collect(Collectors.toSet());
        Map<Long, Echantillon> echantillonMap = echantillonRepo.findAllById(echantillonIds).stream()
                .collect(Collectors.toMap(Echantillon::getId, e -> e));

        Set<String> codesDemande = content.stream()
                .map(EchantillonAnalyse::getCodeDemande).collect(Collectors.toSet());
        Map<String, DemandeAnalyse> demandeMap = demandeRepo.findAllById(codesDemande).stream()
                .collect(Collectors.toMap(DemandeAnalyse::getCodeDemande, d -> d));

        List<EchantillonAnalyseDto> items = content.stream()
                .map(ea -> toDto(ea, echantillonMap.get(ea.getEchantillonId()), demandeMap.get(ea.getCodeDemande())))
                .toList();

        return PagedResponse.of(items, page, size, result.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EchantillonAnalyseDto> getByEchantillon(Long echantillonId) {
        List<EchantillonAnalyse> list = repo.findByEchantillonId(echantillonId);
        if (list.isEmpty()) return List.of();

        Echantillon echantillon = echantillonRepo.findById(echantillonId).orElse(null);
        Set<String> codesDemande = list.stream()
                .map(EchantillonAnalyse::getCodeDemande).collect(Collectors.toSet());
        Map<String, DemandeAnalyse> demandeMap = demandeRepo.findAllById(codesDemande).stream()
                .collect(Collectors.toMap(DemandeAnalyse::getCodeDemande, d -> d));

        return list.stream()
                .map(ea -> toDto(ea, echantillon, demandeMap.get(ea.getCodeDemande())))
                .toList();
    }

    @Override
    public EchantillonAnalyseDto create(EchantillonAnalyseSaveRequest req) {
        Echantillon echantillon = echantillonRepo.findById(req.echantillonId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Echantillon not found with id: " + req.echantillonId()));
        DemandeAnalyse demande = demandeRepo.findById(req.codeDemande())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "DemandeAnalyse not found with code: " + req.codeDemande()));

        EchantillonAnalyse ea = new EchantillonAnalyse();
        ea.setEchantillonId(req.echantillonId());
        ea.setCodeDemande(req.codeDemande());
        ea.setStatut(req.statut() != null && !req.statut().isBlank() ? req.statut() : "En attente");
        ea.setDateAssignation(LocalDateTime.now());

        return toDto(repo.save(ea), echantillon, demande);
    }

    @Override
    public EchantillonAnalyseDto updateStatut(Long id, String statut, String resultat) {
        EchantillonAnalyse ea = findOrThrow(id);
        ea.setStatut(statut);
        ea.setResultat(resultat);

        Echantillon echantillon = echantillonRepo.findById(ea.getEchantillonId()).orElse(null);
        DemandeAnalyse demande = demandeRepo.findById(ea.getCodeDemande()).orElse(null);

        return toDto(repo.save(ea), echantillon, demande);
    }

    @Override
    public void delete(Long id) {
        repo.delete(findOrThrow(id));
    }

    private EchantillonAnalyse findOrThrow(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "EchantillonAnalyse not found with id: " + id));
    }

    private EchantillonAnalyseDto toDto(EchantillonAnalyse ea, Echantillon echantillon, DemandeAnalyse demande) {
        return new EchantillonAnalyseDto(
                ea.getId(),
                ea.getEchantillonId(),
                echantillon != null ? echantillon.getSampleId() : "",
                echantillon != null ? echantillon.getPatientId() : "",
                ea.getCodeDemande(),
                demande != null ? demande.getDesignation() : "",
                ea.getStatut(),
                ea.getResultat(),
                ea.getDateAssignation()
        );
    }
}
