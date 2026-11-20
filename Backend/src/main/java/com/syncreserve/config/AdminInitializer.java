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
import java.util.regex.Pattern;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

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
            log.debug("Admin bootstrap skipped: ADMIN_EMAIL/ADMIN_PASSWORD not configured");
            return;
        }

        String email = adminEmail.trim().toLowerCase();

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            log.warn("Admin bootstrap skipped: configured admin email is invalid");
            return;
        }

        if (userRepository.existsByEmail(email)) {
            log.info("Admin bootstrap skipped: an account already exists for the configured email");
            return;
        }

        User user = new User();
        user.setName(adminName == null || adminName.isBlank()
                ? "Admin"
                : adminName.trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(adminPassword));
        user.setRole("ADMIN");
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);
        log.info("Bootstrap admin account created for {}", email);
    }
}
