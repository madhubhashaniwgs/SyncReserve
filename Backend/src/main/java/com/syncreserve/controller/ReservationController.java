package com.syncreserve.controller;

import com.syncreserve.dto.ReservationRequest;
import com.syncreserve.entity.Reservation;
import com.syncreserve.dto.ReservationResponse;
import com.syncreserve.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.syncreserve.dto.ReservationResponse;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService
    ) {
        this.reservationService = reservationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ReservationResponse> createReservation(
            @RequestBody ReservationRequest request
    ) {

        ReservationResponse reservation =
                reservationService.createReservation(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reservation);
    }



    //Get all reservations
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>>
    getAllReservations() {

        return ResponseEntity.ok(
                reservationService.getAllReservations()
        );
    }

    //Get reservations by event
    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>>
    getReservationsByEvent(
            @PathVariable Long eventId
    ) {

        return ResponseEntity.ok(
                reservationService
                        .getReservationsByEvent(eventId)
        );
    }

    //Cancel reservation
    @DeleteMapping("/{reservationId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> cancelReservation(
            @PathVariable Long reservationId
    ) {

        reservationService.cancelReservation(reservationId);

        return ResponseEntity.noContent().build();
    }

    // Get current user's reservations
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ReservationResponse>>
    getMyReservations() {

        return ResponseEntity.ok(
                reservationService.getMyReservations()
        );
    }
}