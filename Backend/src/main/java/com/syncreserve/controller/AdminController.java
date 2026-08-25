package com.syncreserve.controller;

import com.syncreserve.entity.User;
import com.syncreserve.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminDashboard(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                Map.of(
                        "message", "Welcome to Admin Dashboard",
                        "email", authentication.getName(),
                        "role", "ADMIN"
                )
        );
    }

    // ==========================================
    // GET ALL USERS
    // ==========================================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userRepository.findAll()
        );
    }

    // ==========================================
    // CHANGE USER ROLE
    // ==========================================

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (!role.equals("USER") && !role.equals("ADMIN")) {
            throw new IllegalArgumentException(
                    "Role must be USER or ADMIN"
            );
        }

        user.setRole(role);

        return ResponseEntity.ok(
                userRepository.save(user)
        );
    }

    // ==========================================
    // DELETE USER
    // ==========================================

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long userId
    ) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(userId);

        return ResponseEntity.noContent().build();
    }
}