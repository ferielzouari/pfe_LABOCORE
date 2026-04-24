package com.clinisys.labocore.dto;

public record LoginResponseDto(
        String token,
        String name,
        String role
) {}