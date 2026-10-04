package com.syncreserve.controller;

import com.syncreserve.dto.LoginRequest;
import com.syncreserve.dto.LoginResponse;
import com.syncreserve.dto.RegisterRequest;
import com.syncreserve.dto.RegisterResponse;
import com.syncreserve.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.syncreserve.dto.ForgotPasswordRequest;
import com.syncreserve.dto.ResetPasswordRequest;
import com.syncreserve.dto.ChangePasswordRequest;
import com.syncreserve.dto.VerifyResetCodeRequest;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    //register
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        RegisterResponse response =
                authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // LOGIN


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }

    //forgot password

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        authService.forgotPassword(request);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "A verification code has been sent to your email address."
                )
        );
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<Map<String, String>> verifyResetCode(
            @Valid @RequestBody VerifyResetCodeRequest request
    ) {

        String resetToken = authService.verifyResetCode(request);

        return ResponseEntity.ok(Map.of(
                "message", "Code verified",
                "resetToken", resetToken
        ));
    }

    //reset password

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        authService.resetPassword(request);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password reset successfully"
                )
        );
    }

    //change password

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        authService.changePassword(request);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password changed successfully"
                )
        );
    }

    @GetMapping("/profile/image")
    public ResponseEntity<Map<String, String>> getProfileImage() {
        String imagePath = authService.getProfileImage();
        return ResponseEntity.ok(Map.of(
                "profileImage", imagePath == null ? "" : imagePath
        ));
    }

    @PostMapping("/profile/image")
    public ResponseEntity<Map<String, String>> updateProfileImage(
            @RequestParam("file") MultipartFile file
    ) {

        String imagePath = authService.updateProfileImage(file);

        return ResponseEntity.ok(Map.of(
                "message", "Profile image saved",
                "profileImage", imagePath
        ));
    }

    @DeleteMapping("/profile/image")
    public ResponseEntity<Map<String, String>> removeProfileImage() {
        authService.removeProfileImage();
        return ResponseEntity.ok(Map.of("message", "Profile image removed"));
    }
}