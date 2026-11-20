package com.syncreserve.controller;

import com.syncreserve.dto.CreateEventRequest;
import com.syncreserve.dto.EventResponse;
import com.syncreserve.dto.SeatResponse;
import com.syncreserve.dto.UpdateEventRequest;
import com.syncreserve.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@Validated
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // CREATE EVENT - ADMIN ONLY
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody CreateEventRequest request
    ) {

        EventResponse response =
                eventService.createEvent(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL EVENTS - AUTHENTICATED USERS
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {

        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }

    // GET EVENT - AUTHENTICATED USERS
    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable @Positive Long eventId
    ) {

        return ResponseEntity.ok(
                eventService.getEventById(eventId)
        );
    }

    // UPDATE EVENT - ADMIN ONLY


    @PutMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable @Positive Long eventId,
            @Valid @RequestBody UpdateEventRequest request
    ) {

        return ResponseEntity.ok(
                eventService.updateEvent(
                        eventId,
                        request
                )
        );
    }

    // DELETE EVENT - ADMIN ONLY
    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable @Positive Long eventId
    ) {

        eventService.deleteEvent(eventId);

        return ResponseEntity.noContent().build();
    }

    // GENERATE SEATS - ADMIN ONLY
    @PostMapping("/{eventId}/seats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> generateSeats(
            @PathVariable @Positive Long eventId,
            @RequestParam @Positive @Max(100) int rows,
            @RequestParam @Positive @Max(100) int seatsPerRow
    ) {

        eventService.generateSeats(
                eventId,
                rows,
                seatsPerRow
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Seats generated successfully");
    }

    // UPLOAD COVER IMAGE - ADMIN ONLY
    @PostMapping(value = "/{eventId}/cover-image", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> updateCoverImage(
            @PathVariable @Positive Long eventId,
            @RequestParam("file") MultipartFile file
    ) {

        return ResponseEntity.ok(
                eventService.updateCoverImage(eventId, file)
        );
    }

    // REMOVE COVER IMAGE - ADMIN ONLY
    @DeleteMapping("/{eventId}/cover-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> removeCoverImage(
            @PathVariable @Positive Long eventId
    ) {

        return ResponseEntity.ok(
                eventService.removeCoverImage(eventId)
        );
    }

    // GET SEATS - AUTHENTICATED USERS
    @GetMapping("/{eventId}/seats")
    public ResponseEntity<List<SeatResponse>> getSeats(
            @PathVariable @Positive Long eventId
    ) {

        return ResponseEntity.ok(
                eventService.getSeatsForEvent(eventId)
        );
    }
}