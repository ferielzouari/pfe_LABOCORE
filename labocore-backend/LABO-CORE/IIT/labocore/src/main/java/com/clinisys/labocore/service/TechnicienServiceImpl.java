package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.dto.TechnicienDto;
import com.clinisys.labocore.dto.TechnicienSaveRequest;
import com.clinisys.labocore.entity.Technicien;
import com.clinisys.labocore.exception.ResourceNotFoundException;
import com.clinisys.labocore.repository.TechnicienRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TechnicienServiceImpl implements TechnicienService {

    private final TechnicienRepository repository;

    public TechnicienServiceImpl(TechnicienRepository repository) {
        this.repository = repository;
    }

    @Override
    public PagedResponse<TechnicienDto> list(int page, int size, String search, String service) {
        Page<Technicien> result = repository.search(
                search == null ? "" : search,
                service == null ? "" : service,
                PageRequest.of(page - 1, size)
        );

        List<TechnicienDto> dtos = result.getContent().stream()
                .map(this::toDto)
                .toList();

        return PagedResponse.of(dtos, page, size, result.getTotalElements());
    }

    @Override
    public TechnicienDto getOne(Long id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + id));
    }

    @Override
    @Transactional
    public TechnicienDto create(TechnicienSaveRequest request) {
        if (repository.findByMatricule(request.matricule()).isPresent()) {
            throw new IllegalArgumentException("Technician with matricule " + request.matricule() + " already exists");
        }

        Technicien tech = new Technicien();
        updateEntity(tech, request);
        return toDto(repository.save(tech));
    }

    @Override
    @Transactional
    public TechnicienDto update(Long id, TechnicienSaveRequest request) {
        Technicien tech = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + id));

        repository.findByMatricule(request.matricule()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new IllegalArgumentException("Technician with matricule " + request.matricule() + " already exists");
            }
        });

        updateEntity(tech, request);
        return toDto(repository.save(tech));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Technician not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public List<String> getServices() {
        return repository.findDistinctServices();
    }

    private void updateEntity(Technicien entity, TechnicienSaveRequest request) {
        entity.setMatricule(request.matricule());
        entity.setNom(request.nom());
        entity.setPrenom(request.prenom());
        entity.setSpecialite(request.specialite());
        entity.setTelephone(request.telephone());
        entity.setEmail(request.email());
        entity.setService(request.service());
        entity.setDateEntree(request.dateEntree());
    }

    private TechnicienDto toDto(Technicien entity) {
        return new TechnicienDto(
                entity.getId(),
                entity.getMatricule(),
                entity.getNom(),
                entity.getPrenom(),
                entity.getSpecialite(),
                entity.getTelephone(),
                entity.getEmail(),
                entity.getService(),
                entity.getActif(),
                entity.getDateEntree()
        );
    }
}
