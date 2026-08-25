package com.syncreserve.dto;

public record LoginResponse(
        String token,
        String tokenType,
        Long userId,
        String name,
        String email,
        String role
) {
}