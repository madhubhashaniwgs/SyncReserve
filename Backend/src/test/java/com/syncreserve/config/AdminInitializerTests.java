package com.syncreserve.config;

import com.syncreserve.entity.User;
import com.syncreserve.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminInitializerTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AdminInitializer adminInitializer;

    private AdminInitializer initializer(String email, String password, String name) {
        return new AdminInitializer(userRepository, passwordEncoder, email, password, name);
    }

    @Test
    void createsAdminWhenEmailDoesNotExist() {
        adminInitializer = initializer("Admin@Example.com", "secret123", "Root Admin");
        when(userRepository.existsByEmail("admin@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");

        adminInitializer.run();

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        User saved = captor.getValue();
        assertEquals("admin@example.com", saved.getEmail());
        assertEquals("Root Admin", saved.getName());
        assertEquals("ADMIN", saved.getRole());
        assertEquals("encoded-password", saved.getPassword());
    }

    @Test
    void skipsCreationWhenEmailAlreadyExists() {
        adminInitializer = initializer("admin@example.com", "secret123", "Admin");
        when(userRepository.existsByEmail("admin@example.com")).thenReturn(true);

        adminInitializer.run();

        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void skipsWhenEmailNotConfigured() {
        adminInitializer = initializer("", "secret123", "Admin");

        adminInitializer.run();

        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any());
    }

    @Test
    void skipsWhenPasswordNotConfigured() {
        adminInitializer = initializer("admin@example.com", "  ", "Admin");

        adminInitializer.run();

        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any());
    }

    @Test
    void skipsWhenEmailIsInvalid() {
        adminInitializer = initializer("not-an-email", "secret123", "Admin");

        adminInitializer.run();

        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any());
    }

    @Test
    void defaultsNameWhenBlank() {
        adminInitializer = initializer("admin@example.com", "secret123", "  ");
        when(userRepository.existsByEmail("admin@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");

        adminInitializer.run();

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("Admin", captor.getValue().getName());
    }
}
