package com.fleetflow.controller;

import com.fleetflow.dto.AuthResponse;
import com.fleetflow.dto.LoginRequest;
import com.fleetflow.dto.RegisterRequest;
import com.fleetflow.model.User;
import com.fleetflow.repository.UserRepository;
import com.fleetflow.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private PasswordEncoder passwordEncoder;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User already exists"));
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole() != null ? req.getRole() : "manager");

        user = userRepository.save(user);

        String token = jwtUtils.generateToken(user.getId(), user.getRole(), user.getName());
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(user.getId(), user.getRole(), user.getName());
        return ResponseEntity.ok(new AuthResponse(token, userInfo));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid Credentials"));
        }

        String token = jwtUtils.generateToken(user.getId(), user.getRole(), user.getName());
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(user.getId(), user.getRole(), user.getName());
        return ResponseEntity.ok(new AuthResponse(token, userInfo));
    }
}
