package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.EchantillonDto;
import com.clinisys.labocore.dto.EchantillonSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.entity.Echantillon;
import com.clinisys.labocore.exception.ResourceNotFoundException;
import com.clinisys.labocore.repository.EchantillonRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class EchantillonServiceImpl implements EchantillonService {

    private final EchantillonRepository repo;

    public EchantillonServiceImpl(EchantillonRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<EchantillonDto> listEchantillons(
            int page, int size, String search, String status) {

        PageRequest pageable = PageRequest.of(
                page - 1, size, Sort.by("collectedAt").descending());

        String s = (search != null && !search.isBlank()) ? search : "";
        String st = (status != null && !status.isBlank()) ? status : "";

        Page<Echantillon> result = repo.search(s, st, pageable);

        List<EchantillonDto> items = result.getContent()
                .stream().map(this::toDto).toList();

        return PagedResponse.of(items, page, size, result.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public EchantillonDto getEchantillon(Long id) {
        return toDto(findOrThrow(id));
    }

    @Override
    public EchantillonDto createEchantillon(EchantillonSaveRequest req) {
        Echantillon e = new Echantillon();
        e.setSampleId(generateSampleId());
        e.setPatientId(req.patientId());
        e.setType(req.type());
        e.setPriority(req.priority());
        e.setCollectedAt(LocalDateTime.now());
        e.setStatus("Pending");
        e.setNotes(req.notes());
        return toDto(repo.save(e));
    }

    @Override
    public EchantillonDto updateStatus(Long id, String status) {
        Echantillon e = findOrThrow(id);
        e.setStatus(status);
        return toDto(repo.save(e));
    }

    @Override
    public void deleteEchantillon(Long id) {
        repo.delete(findOrThrow(id));
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private Echantillon findOrThrow(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Echantillon not found with id: " + id));
    }

    private EchantillonDto toDto(Echantillon e) {
        return new EchantillonDto(
                e.getId(),
                e.getSampleId(),
                e.getPatientId(),
                e.getType(),
                e.getPriority(),
                e.getCollectedAt(),
                e.getStatus(),
                e.getNotes()
        );
    }

    private String generateSampleId() {
        String year = String.valueOf(LocalDateTime.now().getYear());
        Long maxId = repo.findMaxId();
        long nextId = (maxId == null ? 0 : maxId) + 1;
        return String.format("SMP-%s-%04d", year, nextId);
    }
}