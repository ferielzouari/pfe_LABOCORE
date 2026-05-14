package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.*;
import com.clinisys.labocore.entity.BonReception;
import com.clinisys.labocore.entity.BonReceptionArticle;
import com.clinisys.labocore.entity.Fournisseur;
import com.clinisys.labocore.exception.ResourceNotFoundException;
import com.clinisys.labocore.repository.BonReceptionArticleRepository;
import com.clinisys.labocore.repository.BonReceptionRepository;
import com.clinisys.labocore.repository.FournisseurRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BonReceptionArticleService {

    private final BonReceptionRepository bonReceptionRepository;
    private final BonReceptionArticleRepository articleRepository;
    private final FournisseurRepository fournisseurRepository;

    public BonReceptionArticleService(BonReceptionRepository bonReceptionRepository,
                                      BonReceptionArticleRepository articleRepository,
                                      FournisseurRepository fournisseurRepository) {
        this.bonReceptionRepository = bonReceptionRepository;
        this.articleRepository = articleRepository;
        this.fournisseurRepository = fournisseurRepository;
    }

    public PagedResponse<BonReceptionArticleDto> findAll(int page, int size, String search) {
        Page<BonReception> bons = bonReceptionRepository.search(search, PageRequest.of(page - 1, size));
        
        List<BonReceptionArticleDto> items = bons.getContent().stream()
                .flatMap(bon -> {
                    String raiSoc = fournisseurRepository.findByCode(bon.getCodFrs())
                            .map(Fournisseur::getRaisonSociale)
                            .orElse("Unknown");
                    
                    List<BonReceptionArticle> articles = articleRepository.findByNumBon(bon.getNumBon());
                    
                    return articles.stream().map(art -> new BonReceptionArticleDto(
                            bon.getNumBon(),
                            bon.getDateBon(),
                            bon.getCodFrs(),
                            raiSoc,
                            art.getCodart(),
                            art.getDesart(),
                            art.getNumLot(),
                            art.getDatePeremption(),
                            art.getQteCmd(),
                            art.getQteRec(),
                            null, // qteLiv
                            art.getId().intValue() // numLigne
                    ));
                })
                .toList();

        return PagedResponse.of(items, page, size, bons.getTotalElements());
    }

    public PagedResponse<BonReceptionDto> listBons(int page, int size, String search) {
        Page<BonReception> bons = bonReceptionRepository.search(search, PageRequest.of(page - 1, size));
        
        List<BonReceptionDto> dtos = bons.getContent().stream().map(bon -> {
            String raiSoc = fournisseurRepository.findByCode(bon.getCodFrs())
                    .map(Fournisseur::getRaisonSociale)
                    .orElse("Unknown");
            
            long count = articleRepository.findByNumBon(bon.getNumBon()).size();
            
            return new BonReceptionDto(
                    bon.getId(),
                    bon.getNumBon(),
                    bon.getDateBon(),
                    bon.getCodFrs(),
                    raiSoc,
                    bon.getDepot(),
                    count
            );
        }).toList();

        return PagedResponse.of(dtos, page, size, bons.getTotalElements());
    }

    @Transactional
    public BonReceptionDto create(BonReceptionSaveRequest request) {
        if (request.lignes() == null || request.lignes().isEmpty()) {
            throw new IllegalArgumentException("At least one article line is required");
        }

        String numBon = generateNumBon();
        
        BonReception bon = new BonReception();
        bon.setNumBon(numBon);
        bon.setDateBon(LocalDateTime.now());
        bon.setCodFrs(request.codFrs());
        bon.setDepot(request.depot());
        
        bon = bonReceptionRepository.save(bon);

        for (BonReceptionLigneRequest line : request.lignes()) {
            BonReceptionArticle article = new BonReceptionArticle();
            article.setNumBon(numBon);
            article.setCodart(line.codart());
            article.setDesart(line.desart());
            article.setNumLot(line.numLot());
            article.setDatePeremption(line.datePeremption());
            article.setQteCmd(line.qteCmd());
            article.setQteRec(line.qteRec());
            articleRepository.save(article);
        }

        String raiSoc = fournisseurRepository.findByCode(bon.getCodFrs())
                .map(Fournisseur::getRaisonSociale)
                .orElse("Unknown");

        return new BonReceptionDto(
                bon.getId(),
                bon.getNumBon(),
                bon.getDateBon(),
                bon.getCodFrs(),
                raiSoc,
                bon.getDepot(),
                (long) request.lignes().size()
        );
    }

    public BonReceptionDto getOne(String numBon) {
        BonReception bon = bonReceptionRepository.findByNumBon(numBon)
                .orElseThrow(() -> new ResourceNotFoundException("Bon de réception not found: " + numBon));
        
        String raiSoc = fournisseurRepository.findByCode(bon.getCodFrs())
                .map(Fournisseur::getRaisonSociale)
                .orElse("Unknown");
        
        long count = articleRepository.findByNumBon(bon.getNumBon()).size();
        
        return new BonReceptionDto(
                bon.getId(),
                bon.getNumBon(),
                bon.getDateBon(),
                bon.getCodFrs(),
                raiSoc,
                bon.getDepot(),
                count
        );
    }

    @Transactional
    public void delete(String numBon) {
        BonReception bon = bonReceptionRepository.findByNumBon(numBon)
                .orElseThrow(() -> new ResourceNotFoundException("Bon de réception not found: " + numBon));
        
        articleRepository.deleteByNumBon(numBon);
        bonReceptionRepository.delete(bon);
    }

    private String generateNumBon() {
        int year = LocalDateTime.now().getYear();
        String prefix = "BAB" + year;
        String maxNum = bonReceptionRepository.findMaxNumBon(prefix + "%");
        
        int sequence = 1;
        if (maxNum != null && maxNum.length() >= 11) {
            try {
                sequence = Integer.parseInt(maxNum.substring(7)) + 1;
            } catch (NumberFormatException ignored) {}
        }
        
        return String.format("%s%04d", prefix, sequence);
    }
}