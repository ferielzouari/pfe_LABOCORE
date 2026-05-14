package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.PagedResponse;
import com.clinisys.labocore.dto.StockDto;
import com.clinisys.labocore.entity.StockEntity;
import com.clinisys.labocore.repository.StockRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class StockServiceImpl implements StockService {

    private final StockRepository repo;

    public StockServiceImpl(StockRepository repo) {
        this.repo = repo;
    }

    @Override
    public PagedResponse<StockDto> list(int page, int size, String search, String famArt) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        
        String s = (search != null && !search.trim().isEmpty()) ? search : "";
        String f = (famArt != null && !famArt.trim().isEmpty()) ? famArt : "";

        Page<StockEntity> result = repo.search(s, f, pageable);

        List<StockDto> items = result.getContent()
                .stream().map(this::toDto).toList();

        return PagedResponse.of(items, page, size, result.getTotalElements());
    }

    private StockDto toDto(StockEntity s) {
        String status = "Normal";
        if (s.getStkDep() != null && s.getStkMin() != null) {
            if (s.getStkDep().compareTo(s.getStkMin()) <= 0) {
                status = "Critical";
            }
        }
        
        return new StockDto(
                s.getCodart(),
                s.getDesart(),
                s.getUnimes(),
                s.getStkDep(),
                s.getStkMin(),
                s.getStkMax(),
                s.getFamArt(),
                s.getActif(),
                status
        );
    }
}
