package com.syncreserve.config;

import com.syncreserve.entity.User;
import com.syncreserve.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public AdminInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String adminEmail,
            @Value("${app.admin.password:}") String adminPassword,
            @Value("${app.admin.name:Admin}") String adminName
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    @Override
    public void run(String... args) {
        if (adminEmail == null || adminEmail.isBlank()
                || adminPassword == null || adminPassword.isBlank()) {
            return;
        }

        String email = adminEmail.trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElseGet(User::new);
        boolean isNew = user.getId() == null;

        if (isNew) {
            user.setName(adminName.trim());
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(adminPassword));
            user.setCreatedAt(LocalDateTime.now());
        } else if (!passwordEncoder.matches(adminPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(adminPassword));
        }

        if (!"ADMIN".equals(user.getRole())) {
            user.setRole("ADMIN");
        }

        userRepository.save(user);
        log.info("Admin account ready for {}", email);
    }
}
