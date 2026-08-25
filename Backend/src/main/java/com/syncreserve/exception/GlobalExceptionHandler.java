package com.syncreserve.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException exception
    ) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
            IllegalArgumentException exception
    ) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage()
        );

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    public record ErrorResponse(
            LocalDateTime timestamp,
            int status,
            String message
    ) {
    }

    @ExceptionHandler(SeatAlreadyReservedException.class)
    public ResponseEntity<Map<String, Object>> handleSeatAlreadyReserved(
            SeatAlreadyReservedException exception
    ) {

        Map<String, Object> response = Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 409,
                "error", "Conflict",
                "message", exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(
            DataIntegrityViolationException exception
    ) {

        Map<String, Object> response = Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 409,
                "error", "Conflict",
                "message", "Seat is already reserved"
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception
    ) {

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Invalid request");

        Map<String, Object> response = Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 400,
                "error", "Bad Request",
                "message", message
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    @ExceptionHandler(UnauthorizedReservationAccessException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedReservationAccess(
            UnauthorizedReservationAccessException exception
    ) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.FORBIDDEN.value(),
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }
}