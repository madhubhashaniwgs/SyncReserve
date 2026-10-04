package com.syncreserve.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(
            String email,
            String code
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("SyncReserve - Reset Your Password");

        message.setText(
                "Hello,\n\n"
                + "We received a request to reset your SyncReserve password.\n\n"
                + "Your verification code is: " + code + "\n\n"
                + "Enter this code in SyncReserve to continue. It will expire in 15 minutes.\n\n"
                + "If you did not request a password reset, you can safely ignore this email.\n\n"
                + "Regards,\n"
                + "SyncReserve Team"
        );

        mailSender.send(message);
    }
}