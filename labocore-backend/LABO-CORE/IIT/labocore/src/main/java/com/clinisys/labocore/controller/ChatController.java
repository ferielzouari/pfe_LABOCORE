package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.ChatRequestDto;
import com.clinisys.labocore.dto.ChatResponseDto;
import com.clinisys.labocore.service.ChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponseDto sendMessage(@RequestBody ChatRequestDto request) {
        return chatService.sendMessage(request.messages());
    }
}
