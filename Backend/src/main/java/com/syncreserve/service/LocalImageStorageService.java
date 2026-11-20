package com.syncreserve.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalImageStorageService implements ImageStorageService {

    private final Path imageDirectory;

    public LocalImageStorageService(
            @Value("${app.event-image-directory:event-images}") String imageDirectory
    ) {
        this.imageDirectory = Paths.get(imageDirectory)
                .toAbsolutePath()
                .normalize();
    }

    @Override
    public String store(MultipartFile file, String filename) {
        try {
            Files.createDirectories(imageDirectory);

            Path targetPath = imageDirectory.resolve(filename).normalize();

            if (!targetPath.startsWith(imageDirectory)) {
                throw new IllegalArgumentException("Invalid image filename");
            }

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/event-images/" + filename;
        } catch (IOException exception) {
            throw new RuntimeException("Unable to save event image", exception);
        }
    }

    @Override
    public void delete(String storedReference) {
        if (storedReference == null || storedReference.isBlank()
                || !storedReference.startsWith("/event-images/")) {
            return;
        }

        String filename = storedReference.substring("/event-images/".length());

        if (filename.isBlank() || filename.contains("/")
                || filename.contains("\\")) {
            return;
        }

        try {
            Files.deleteIfExists(imageDirectory.resolve(filename).normalize());
        } catch (IOException ignored) {
            // Missing files must not block database cleanup.
        }
    }
}
