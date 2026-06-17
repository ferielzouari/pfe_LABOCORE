package com.clinisys.labocore.dto;

import java.util.List;

public record ChatRequestDto(
        List<ChatMessageDto> messages
) {}
