package com.clinisys.labocore.service;

import com.clinisys.labocore.config.JwtUtil;
import com.clinisys.labocore.dto.LoginRequestDto;
import com.clinisys.labocore.dto.LoginResponseDto;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final String DEMO_USER = "admin";
    private static final String DEMO_PASS = "admin";
    private static final String ROLE_LAB_STAFF = "LAB_STAFF";
    private static final String ROLE_ADMIN = "ADMIN";

    private final JwtUtil jwtUtil;

    public AuthService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDto login(LoginRequestDto request) {
        String username = request.username();
        String password = request.password();

        String name;
        String role;

        if (DEMO_USER.equals(username) && DEMO_PASS.equals(password)) {
            name = "Admin Labo";
            role = ROLE_ADMIN;
        } else if (!username.isBlank() && !password.isBlank()) {
            // Accept any non-empty creds for dev convenience
            name = capitalize(username);
            role = ROLE_LAB_STAFF;
        } else {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // Generate a real JWT token
        String token = jwtUtil.generateToken(username, role);
        return new LoginResponseDto(token, name, role);
    }

    private String capitalize(String s) {
        if (s == null || s.isBlank()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase();
    }
}
