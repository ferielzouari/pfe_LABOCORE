package com.clinisys.labocore.service;

import com.clinisys.labocore.dto.ChatMessageDto;
import com.clinisys.labocore.dto.ChatResponseDto;

import java.util.List;

public interface ChatService {
    ChatResponseDto sendMessage(List<ChatMessageDto> messages);
}
