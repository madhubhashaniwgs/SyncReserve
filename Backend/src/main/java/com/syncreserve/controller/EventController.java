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
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/events")
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
            @PathVariable Long eventId
    ) {

        return ResponseEntity.ok(
                eventService.getEventById(eventId)
        );
    }

    // UPDATE EVENT - ADMIN ONLY


    @PutMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long eventId,
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
            @PathVariable Long eventId
    ) {

        eventService.deleteEvent(eventId);

        return ResponseEntity.noContent().build();
    }

    // GENERATE SEATS - ADMIN ONLY
    @PostMapping("/{eventId}/seats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> generateSeats(
            @PathVariable Long eventId,
            @RequestParam int rows,
            @RequestParam int seatsPerRow
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

    // GET SEATS - AUTHENTICATED USERS
    @GetMapping("/{eventId}/seats")
    public ResponseEntity<List<SeatResponse>> getSeats(
            @PathVariable Long eventId
    ) {

        return ResponseEntity.ok(
                eventService.getSeatsForEvent(eventId)
        );
    }
}