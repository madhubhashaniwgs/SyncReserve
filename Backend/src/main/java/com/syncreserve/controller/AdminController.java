package com.syncreserve.controller;

import com.syncreserve.entity.User;
import com.syncreserve.dto.AdminUserResponse;
import com.syncreserve.exception.ResourceNotFoundException;
import com.syncreserve.repository.ReservationRepository;
import com.syncreserve.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Validated
public class AdminController {

    private final UserRepository userRepository;
        private final ReservationRepository reservationRepository;

        public AdminController(
                        UserRepository userRepository,
                        ReservationRepository reservationRepository
        ) {
        this.userRepository = userRepository;
                this.reservationRepository = reservationRepository;
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
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                userRepository.findAll()
                        .stream()
                        .map(this::toAdminUserResponse)
                        .toList()
        );
    }

    // ==========================================
    // CHANGE USER ROLE
    // ==========================================

    @PutMapping("/users/{userId}/role")
        public ResponseEntity<AdminUserResponse> updateUserRole(
                    @PathVariable @Positive Long userId,
            @RequestParam String role
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        if (!role.equals("USER") && !role.equals("ADMIN")) {
            throw new IllegalArgumentException(
                    "Role must be USER or ADMIN"
            );
        }

        user.setRole(role);

        return ResponseEntity.ok(toAdminUserResponse(userRepository.save(user)));
    }

    // ==========================================
    // DELETE USER
    // ==========================================

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(
                        @PathVariable @Positive Long userId,
                        Authentication authentication
    ) {

                User user = userRepository.findById(userId)
                                .orElseThrow(() ->
                                                new ResourceNotFoundException("User not found")
                                );

                if (user.getEmail().equalsIgnoreCase(authentication.getName())) {
                        throw new IllegalArgumentException("You cannot delete your own account");
                }

                if ("ADMIN".equals(user.getRole()) &&
                                userRepository.countByRole("ADMIN") <= 1) {
                        throw new IllegalArgumentException("The last administrator cannot be deleted");
        }

                reservationRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);

        return ResponseEntity.noContent().build();
    }

        private AdminUserResponse toAdminUserResponse(User user) {
                return new AdminUserResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole(),
                                user.getCreatedAt(),
                                user.getProfileImage()
                );
        }
}