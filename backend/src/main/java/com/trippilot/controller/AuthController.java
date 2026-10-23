package com.trippilot.controller;

import com.trippilot.model.User;
import com.trippilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null || user.getName() == null) {
            return ResponseEntity.badRequest().body("Please fill in all required fields.");
        }

        if (userRepository.existsByEmail(user.getEmail().toLowerCase())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already registered!");
        }

        user.setEmail(user.getEmail().toLowerCase());
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginReq) {
        if (loginReq.getEmail() == null || loginReq.getPassword() == null) {
            return ResponseEntity.badRequest().body("Please provide email and password.");
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(loginReq.getEmail().toLowerCase());
        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Account not found! Please register first.");
        }

        User user = existingUserOpt.get();
        if (!user.getPassword().equals(loginReq.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password!");
        }

        return ResponseEntity.ok(user);
    }
}
