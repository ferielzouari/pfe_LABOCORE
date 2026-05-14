package com.clinisys.labocore.dto;

import java.math.BigDecimal;

public record StockDto(
        String codart,
        String desart,
        String unimes,
        BigDecimal stkDep,
        BigDecimal stkMin,
        BigDecimal stkMax,
        String famArt,
        Boolean actif,
        String stockStatus
) {}
