package com.syncreserve.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_email",
                        columnNames = "email"
                )
        }
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "profile_image", columnDefinition = "TEXT")
    private String profileImage;

    @JsonIgnore
    @Column(length = 255)
    private String resetToken;

    @JsonIgnore
    private LocalDateTime resetTokenExpiry;

    @JsonIgnore
    @Column(length = 100)
    private String resetCode;

    @JsonIgnore
    private LocalDateTime resetCodeExpiry;

    @JsonIgnore
    private Boolean resetCodeVerified;

    private Integer resetCodeAttempts;

    public User() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public LocalDateTime getResetTokenExpiry() {
        return resetTokenExpiry;
    }

    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry;
    }

    public String getResetCode() {
        return resetCode;
    }

    public void setResetCode(String resetCode) {
        this.resetCode = resetCode;
    }

    public LocalDateTime getResetCodeExpiry() {
        return resetCodeExpiry;
    }

    public void setResetCodeExpiry(LocalDateTime resetCodeExpiry) {
        this.resetCodeExpiry = resetCodeExpiry;
    }

    public boolean isResetCodeVerified() {
        return Boolean.TRUE.equals(resetCodeVerified);
    }

    public void setResetCodeVerified(boolean resetCodeVerified) {
        this.resetCodeVerified = resetCodeVerified;
    }

    public Integer getResetCodeAttempts() {
        return resetCodeAttempts;
    }

    public void setResetCodeAttempts(Integer resetCodeAttempts) {
        this.resetCodeAttempts = resetCodeAttempts;
    }
}