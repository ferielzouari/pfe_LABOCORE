package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.MouvementStockDto;
import com.clinisys.labocore.dto.MouvementStockSaveRequest;
import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.entity.MouvementStock;
import com.clinisys.labocore.exception.ResourceNotFoundException;
import com.clinisys.labocore.repository.MouvementStockRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class MouvementStockServiceImpl implements MouvementStockService {

    private static final Set<String> ALLOWED_TYPES = Set.of("SORTIE", "ENTREE", "AJUSTEMENT");

    private final MouvementStockRepository repo;

    public MouvementStockServiceImpl(MouvementStockRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<MouvementStockDto> list(int page, int size, String codart, String type) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<MouvementStock> result = repo.findAll(pageable);
        List<MouvementStockDto> items = result.getContent().stream().map(this::toDto).toList();
        return PagedResponse.of(items, page, size, result.getTotalElements());
    }

    @Override
    public MouvementStockDto create(MouvementStockSaveRequest req) {
        if (!ALLOWED_TYPES.contains(req.typeMouvement())) {
            throw new IllegalArgumentException(
                    "typeMouvement must be one of: SORTIE, ENTREE, AJUSTEMENT");
        }
        MouvementStock m = new MouvementStock();
        m.setCodart(req.codart());
        m.setTypeMouvement(req.typeMouvement());
        m.setQuantite(req.quantite());
        m.setNumLot(req.numLot());
        m.setDatePeremption(req.datePeremption());
        m.setDateMouvement(LocalDateTime.now());
        m.setMotif(req.motif());
        m.setUtilisateur(req.utilisateur());
        return toDto(repo.save(m));
    }

    @Override
    public void delete(Long id) {
        repo.delete(findOrThrow(id));
    }

    private MouvementStock findOrThrow(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "MouvementStock not found with id: " + id));
    }

    private MouvementStockDto toDto(MouvementStock m) {
        return new MouvementStockDto(
                m.getId(),
                m.getCodart(),
                m.getTypeMouvement(),
                m.getQuantite(),
                m.getNumLot(),
                m.getDatePeremption(),
                m.getDateMouvement(),
                m.getMotif(),
                m.getUtilisateur()
        );
    }
}
