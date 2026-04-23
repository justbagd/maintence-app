package com.example.maintenance.controller;

import com.example.maintenance.model.LoginRequest;
import com.example.maintenance.model.LoginResponse;
import com.example.maintenance.model.User;
import com.example.maintenance.model.UserResponse;
import com.example.maintenance.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        String token = "mock-token-" + user.getId();
        LoginResponse response = new LoginResponse(UserResponse.from(user), token);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        User saved = authService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.from(saved));
    }
}
