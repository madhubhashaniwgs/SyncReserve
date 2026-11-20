package com.syncreserve.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

public final class ImageValidation {

    public static final long MAX_IMAGE_SIZE_BYTES = 5L * 1024 * 1024;

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp");

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");

    private ImageValidation() {
    }

    /**
     * Validates size, extension, declared MIME type, and actual file
     * content (magic bytes). Returns the lowercase file extension.
     */
    public static String validateAndGetExtension(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image");
        }

        if (file.getSize() > MAX_IMAGE_SIZE_BYTES) {
            throw new IllegalArgumentException(
                    "Image size must not exceed 5MB"
            );
        }

        String contentType = file.getContentType();
        if (contentType == null
                || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG, and WebP images are allowed"
            );
        }

        String extension = getExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG, and WebP images are allowed"
            );
        }

        if (!hasValidImageSignature(file, extension)) {
            throw new IllegalArgumentException(
                    "File content is not a valid image"
            );
        }

        return extension;
    }

    private static String getExtension(String filename) {
        if (filename == null) {
            return "";
        }

        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            return "";
        }

        return filename.substring(dotIndex + 1).toLowerCase();
    }

    private static boolean hasValidImageSignature(
            MultipartFile file,
            String extension
    ) {
        byte[] header;
        try (InputStream input = file.getInputStream()) {
            header = input.readNBytes(16);
        } catch (IOException exception) {
            throw new IllegalArgumentException(
                    "Unable to read uploaded image"
            );
        }

        return switch (extension) {
            case "jpg", "jpeg" -> startsWith(header,
                    (byte) 0xFF, (byte) 0xD8, (byte) 0xFF);
            case "png" -> startsWith(header,
                    (byte) 0x89, (byte) 0x50, (byte) 0x4E, (byte) 0x47,
                    (byte) 0x0D, (byte) 0x0A, (byte) 0x1A, (byte) 0x0A);
            case "webp" -> header.length >= 12
                    && header[0] == 'R' && header[1] == 'I'
                    && header[2] == 'F' && header[3] == 'F'
                    && header[8] == 'W' && header[9] == 'E'
                    && header[10] == 'B' && header[11] == 'P';
            default -> false;
        };
    }

    private static boolean startsWith(byte[] data, byte... prefix) {
        if (data.length < prefix.length) {
            return false;
        }

        for (int i = 0; i < prefix.length; i++) {
            if (data[i] != prefix[i]) {
                return false;
            }
        }

        return true;
    }
}
