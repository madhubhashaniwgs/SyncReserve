package com.syncreserve.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.profile-directory:profile}")
    private String profileDirectory;

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {

        registry
                .addResourceHandler("/profile/**")
            .addResourceLocations(
                    Paths.get(profileDirectory)
                        .toAbsolutePath()
                        .normalize()
                        .toUri()
                        .toString()
            );
    }
}