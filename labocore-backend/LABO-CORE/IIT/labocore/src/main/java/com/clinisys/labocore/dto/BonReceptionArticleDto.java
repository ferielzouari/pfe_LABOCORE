package com.clinisys.labocore.dto;

import java.time.LocalDateTime;

public record BonReceptionArticleDto(
        String numbon,
        LocalDateTime datebon,
        String codFrs,
        String raiSoc,
        String codart,
        String desart,
        String numLot,
        LocalDateTime datePeremption,
        Double qteCmd,
        Double qteRec,
        Double qteLiv,
        Integer numLigne
) {}