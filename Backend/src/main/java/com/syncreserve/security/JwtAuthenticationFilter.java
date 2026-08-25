package com.syncreserve.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        System.out.println(
                "Authorization Header: " + authorizationHeader
        );

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            System.out.println("No Bearer token found");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);

        try {

            System.out.println("JWT received");

            if (jwtService.isTokenValid(token)) {

                String email =
                        jwtService.extractEmail(token);

                var claims =
                        jwtService.getClaims(token);

                String role =
                        claims.get("role", String.class);

                System.out.println(
                        "JWT valid for user: " + email
                );

                System.out.println(
                        "User role: " + role
                );

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(authority)
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                System.out.println(
                        "Authentication added to SecurityContext"
                );

            } else {

                System.out.println("JWT is invalid");
            }

        } catch (Exception exception) {

            System.out.println(
                    "JWT ERROR: " +
                            exception.getClass().getName()
            );

            System.out.println(
                    "JWT ERROR MESSAGE: " +
                            exception.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}