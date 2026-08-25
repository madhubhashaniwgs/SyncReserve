package com.syncreserve.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

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
}