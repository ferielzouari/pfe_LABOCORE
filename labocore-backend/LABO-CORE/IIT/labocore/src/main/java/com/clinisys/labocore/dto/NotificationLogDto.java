package com.clinisys.labocore.dto;

import java.math.BigDecimal;

public record NotificationLogDto(
    String codart,
    String desart,
    String supplierName,
    String supplierEmail,
    BigDecimal stockLevel,
    String sentAt,
    String status
) {}
