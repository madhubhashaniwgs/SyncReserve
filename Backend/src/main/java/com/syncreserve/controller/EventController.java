package com.syncreserve.controller;

import com.syncreserve.dto.CreateEventRequest;
import com.syncreserve.dto.EventResponse;
import com.syncreserve.dto.SeatResponse;
import com.syncreserve.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody CreateEventRequest request
    ) {

        EventResponse response =
                eventService.createEvent(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {

        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable Long eventId
    ) {

        return ResponseEntity.ok(
                eventService.getEventById(eventId)
        );
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long eventId
    ) {

        eventService.deleteEvent(eventId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{eventId}/seats")
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

    @GetMapping("/{eventId}/seats")
    public ResponseEntity<List<SeatResponse>> getSeats(
            @PathVariable Long eventId
    ) {

        return ResponseEntity.ok(
                eventService.getSeatsForEvent(eventId)
        );
    }
}