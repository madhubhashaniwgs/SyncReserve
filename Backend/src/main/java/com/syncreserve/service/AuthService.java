package com.syncreserve.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import com.syncreserve.dto.LoginRequest;
import com.syncreserve.dto.LoginResponse;
import com.syncreserve.dto.RegisterRequest;
import com.syncreserve.dto.RegisterResponse;
import com.syncreserve.entity.User;
import com.syncreserve.security.JwtService;
import com.syncreserve.repository.UserRepository;
import com.syncreserve.repository.PasswordResetTokenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.syncreserve.dto.ForgotPasswordRequest;
import com.syncreserve.dto.ResetPasswordRequest;
import com.syncreserve.dto.VerifyResetCodeRequest;
import com.syncreserve.exception.ResourceNotFoundException;
import com.syncreserve.dto.ChangePasswordRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.UUID;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final Path profileDirectory;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
        private final int resetCodeLength;
        private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            PasswordResetTokenRepository passwordResetTokenRepository,
            EmailService emailService,
                        JwtService jwtService,
                                                @Value("${app.profile-directory:profile}") String profileDirectory,
                                                @Value("${app.reset-code-length:6}") int resetCodeLength
    ) {
                if (resetCodeLength < 4 || resetCodeLength > 8) {
                        throw new IllegalArgumentException("Reset code length must be between 4 and 8");
                }

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.resetCodeLength = resetCodeLength;
                this.profileDirectory = Paths.get(profileDirectory)
                                .toAbsolutePath()
                                .normalize();
    }

    //Register

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        User user = new User();

        user.setName(request.name().trim());
        user.setEmail(email);

        // Never store the plain-text password.
        user.setPassword(
                passwordEncoder.encode(request.password())
        );

        // Default role for newly registered users.
        user.setRole("USER");

        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getCreatedAt()
        );
    }



    // LOGIN
    // ==========================================

    public LoginResponse login(LoginRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.password(),
                        user.getPassword()
                );

        if (!passwordMatches) {

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                );

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }



    //fogot password

        public void forgotPassword(ForgotPasswordRequest request) {

                String email = request.getEmail().trim().toLowerCase();

                User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        String resetCode = generateResetCode();

        user.setResetCode(passwordEncoder.encode(resetCode));
        user.setResetCodeVerified(false);
        user.setResetCodeAttempts(0);
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        user.setResetCodeExpiry(
                LocalDateTime.now().plusMinutes(15)
        );

        userRepository.save(user);

        emailService.sendPasswordResetEmail(
                user.getEmail(),
                resetCode
        );
    }

    @Transactional
    public String verifyResetCode(VerifyResetCodeRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification code"));

        int attempts = user.getResetCodeAttempts() == null
                ? 0
                : user.getResetCodeAttempts();

        if (user.getResetCode() == null ||
                user.getResetCodeExpiry() == null ||
                user.getResetCodeExpiry().isBefore(LocalDateTime.now()) ||
                attempts >= 5) {
            throw new IllegalArgumentException("Invalid or expired verification code");
        }

        if (!passwordEncoder.matches(request.getCode().trim(), user.getResetCode())) {
            user.setResetCodeAttempts(attempts + 1);
            userRepository.save(user);
            throw new IllegalArgumentException("Invalid or expired verification code");
        }

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        user.setResetCodeAttempts(0);
        user.setResetCodeVerified(true);
        userRepository.save(user);

        return resetToken;
    }


    //reset password

    public void resetPassword(ResetPasswordRequest request) {

        User user = userRepository
                .findByResetToken(request.getToken())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid reset token"
                        )
                );

        if (!user.isResetCodeVerified() ||
                user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Reset token has expired"
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        user.setResetCodeVerified(false);
        user.setResetCodeAttempts(0);

        userRepository.save(user);
    }

        private String generateResetCode() {
                int minimum = (int) Math.pow(10, resetCodeLength - 1);
                int bound = (int) Math.pow(10, resetCodeLength) - minimum;
                return String.valueOf(minimum + secureRandom.nextInt(bound));
        }

    //change password

    public void changePassword(ChangePasswordRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new IllegalArgumentException(
                    "Current password is incorrect"
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {

            throw new IllegalArgumentException(
                    "New password must be different from current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);
    }

    public String getProfileImage() {
        return getCurrentUser().getProfileImage();
    }

    @Transactional
    public String updateProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "Image size must not exceed 5MB"
            );
        }

        String extension = getAllowedExtension(file);
        User user = getCurrentUser();

        try {
            String filename = "user_" + user.getId() + "_" +
                    UUID.randomUUID() + extension;

            Files.createDirectories(profileDirectory);

            Path targetPath = profileDirectory.resolve(filename).normalize();
            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            deleteStoredImage(user.getProfileImage());

            String imagePath = "/profile/" + filename;
            user.setProfileImage(imagePath);
            userRepository.save(user);

            return imagePath;
        } catch (IOException exception) {
            throw new RuntimeException("Unable to save profile image", exception);
        }
    }

    @Transactional
    public void removeProfileImage() {
        User user = getCurrentUser();
        deleteStoredImage(user.getProfileImage());
        user.setProfileImage(null);
        userRepository.save(user);
    }

    private String getAllowedExtension(MultipartFile file) {
                String contentType = file.getContentType();
                if (!"image/jpeg".equals(contentType) &&
                                !"image/png".equals(contentType) &&
                                !"image/webp".equals(contentType)) {
                        throw new IllegalArgumentException(
                                        "Only JPG, JPEG, PNG, and WebP images are allowed"
                        );
                }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename == null
                ? ""
                : originalFilename.substring(
                        originalFilename.lastIndexOf('.') + 1
                ).toLowerCase();

        if (!extension.equals("jpg") &&
                !extension.equals("jpeg") &&
                !extension.equals("png") &&
                !extension.equals("webp")) {
            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG, and WebP images are allowed"
            );
        }

        return "." + extension;
    }

    private void deleteStoredImage(String imagePath) {
        if (imagePath == null || imagePath.isBlank()) {
            return;
        }

        String filename = imagePath.startsWith("/profile/")
                ? imagePath.substring("/profile/".length())
                : "";

        if (filename.isBlank() || filename.contains("/") ||
                filename.contains("\\")) {
            return;
        }

        try {
            Files.deleteIfExists(profileDirectory.resolve(filename).normalize());
        } catch (IOException ignored) {
            // Database cleanup must still complete when an old file is missing.
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

}