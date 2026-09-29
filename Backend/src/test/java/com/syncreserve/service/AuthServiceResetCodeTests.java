package com.syncreserve.service;

import com.syncreserve.dto.ForgotPasswordRequest;
import com.syncreserve.dto.VerifyResetCodeRequest;
import com.syncreserve.entity.User;
import com.syncreserve.repository.UserRepository;
import com.syncreserve.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceResetCodeTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private EmailService emailService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                passwordEncoder,
                emailService,
                jwtService,
                "profile",
                6
        );
    }

    @Test
    void forgotPasswordSendsSixDigitCodeAndStoresExpiry() {
        User user = user();
        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.encode(any(String.class)))
                .thenReturn("hashed-code");

        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("user@example.com");

        authService.forgotPassword(request);

        ArgumentCaptor<String> codeCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendPasswordResetEmail(
                any(String.class),
                codeCaptor.capture()
        );

        assertTrue(codeCaptor.getValue().matches("\\d{6}"));
        assertEquals("hashed-code", user.getResetCode());
        assertNotNull(user.getResetCodeExpiry());
        assertEquals(0, user.getResetCodeAttempts());
    }

    @Test
    void verifyResetCodeIssuesOneTimeResetToken() {
        User user = user();
        user.setResetCode("hashed-code");
        user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(15));
        user.setResetCodeAttempts(0);

        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "hashed-code"))
                .thenReturn(true);

        VerifyResetCodeRequest request = new VerifyResetCodeRequest();
        request.setEmail("user@example.com");
        request.setCode("123456");

        String resetToken = authService.verifyResetCode(request);

        assertNotNull(resetToken);
        assertTrue(user.isResetCodeVerified());
        assertEquals(0, user.getResetCodeAttempts());
        assertNotNull(user.getResetTokenExpiry());
        assertNull(user.getResetCode());
    }

    @Test
    void unknownEmailDoesNotSendEmailOrRevealAccountExistence() {
        when(userRepository.findByEmail("unknown@example.com"))
                .thenReturn(Optional.empty());

        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("unknown@example.com");

        authService.forgotPassword(request);

        verify(emailService, never())
                .sendPasswordResetEmail(any(String.class), any(String.class));
    }

    @Test
    void rejectsResetCodeAfterFiveFailedAttempts() {
        User user = user();
        user.setResetCode("hashed-code");
        user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(15));
        user.setResetCodeAttempts(5);

        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(user));

        VerifyResetCodeRequest request = new VerifyResetCodeRequest();
        request.setEmail("user@example.com");
        request.setCode("123456");

        assertThrows(
                IllegalArgumentException.class,
                () -> authService.verifyResetCode(request)
        );

        verify(passwordEncoder, never())
                .matches(any(String.class), any(String.class));
    }

    @Test
    void rejectsExpiredResetCode() {
        User user = user();
        user.setResetCode("hashed-code");
        user.setResetCodeExpiry(LocalDateTime.now().minusMinutes(1));
        user.setResetCodeAttempts(0);

        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(user));

        VerifyResetCodeRequest request = new VerifyResetCodeRequest();
        request.setEmail("user@example.com");
        request.setCode("123456");

        assertThrows(
                IllegalArgumentException.class,
                () -> authService.verifyResetCode(request)
        );
    }

    private User user() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("user@example.com");
        return user;
    }
}
