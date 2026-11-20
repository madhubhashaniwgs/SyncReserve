package com.syncreserve.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    /**
     * Persists the image and returns the publicly resolvable URL/path
     * that should be stored in the database.
     */
    String store(MultipartFile file, String filename);

    /**
     * Removes a previously stored image. Must tolerate missing files.
     */
    void delete(String storedReference);
}
