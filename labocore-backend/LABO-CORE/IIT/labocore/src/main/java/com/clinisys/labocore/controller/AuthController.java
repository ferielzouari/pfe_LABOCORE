package com.clinisys.labocore.controller;

import com.clinisys.labocore.dto.LoginRequestDto;
import com.clinisys.labocore.dto.LoginResponseDto;
import com.clinisys.labocore.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        LoginResponseDto response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Stateless mock — client simply discards the token
        return ResponseEntity.noContent().build();
    }
}