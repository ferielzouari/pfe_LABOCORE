package com.clinisys.labocore.dto;

import java.math.BigDecimal;

public record StockAlertDto(
    String codart,
    String desart,
    BigDecimal stkDep,
    BigDecimal stkMin,
    String famArt,
    String supplierEmail,
    String supplierName
) {}
