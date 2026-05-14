package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.FournisseurDto;
import com.clinisys.labocore.dto.FournisseurSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.entity.Fournisseur;
import com.clinisys.labocore.exception.ResourceNotFoundException;
import com.clinisys.labocore.repository.FournisseurRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository repository;

    public FournisseurServiceImpl(FournisseurRepository repository) {
        this.repository = repository;
    }

    @Override
    public PagedResponse<FournisseurDto> findAll(int page, int size, String search) {
        Page<Fournisseur> result = repository.search(search, PageRequest.of(page - 1, size));
        List<FournisseurDto> dtos = result.getContent().stream().map(this::toDto).toList();
        return PagedResponse.of(dtos, page, size, result.getTotalElements());
    }

    @Override
    public List<FournisseurDto> findAllNoPagination() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public FournisseurDto findById(Long id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Fournisseur not found with id: " + id));
    }

    @Override
    @Transactional
    public FournisseurDto create(FournisseurSaveRequest request) {
        if (repository.findByCode(request.code()).isPresent()) {
            throw new IllegalArgumentException("Supplier with code " + request.code() + " already exists");
        }
        Fournisseur fournisseur = new Fournisseur();
        updateEntity(fournisseur, request);
        return toDto(repository.save(fournisseur));
    }

    @Override
    @Transactional
    public FournisseurDto update(Long id, FournisseurSaveRequest request) {
        Fournisseur fournisseur = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fournisseur not found with id: " + id));
        
        repository.findByCode(request.code()).ifPresent(f -> {
            if (!f.getId().equals(id)) {
                throw new IllegalArgumentException("Supplier with code " + request.code() + " already exists");
            }
        });

        updateEntity(fournisseur, request);
        return toDto(repository.save(fournisseur));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Fournisseur not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void updateEntity(Fournisseur entity, FournisseurSaveRequest request) {
        entity.setCode(request.code());
        entity.setRaisonSociale(request.raisonSociale());
        entity.setTelephone(request.telephone());
        entity.setEmail(request.email());
        entity.setAdresse(request.adresse());
    }

    private FournisseurDto toDto(Fournisseur entity) {
        return new FournisseurDto(
                entity.getId(),
                entity.getCode(),
                entity.getRaisonSociale(),
                entity.getTelephone(),
                entity.getEmail(),
                entity.getAdresse(),
                entity.getActif()
        );
    }
}
