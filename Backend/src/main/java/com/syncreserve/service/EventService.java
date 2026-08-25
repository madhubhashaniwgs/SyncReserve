package com.syncreserve.service;

import com.syncreserve.dto.CreateEventRequest;
import com.syncreserve.dto.EventResponse;
import com.syncreserve.dto.SeatResponse;
import com.syncreserve.dto.UpdateEventRequest;
import com.syncreserve.entity.Event;
import com.syncreserve.entity.Seat;
import com.syncreserve.exception.ResourceNotFoundException;
import com.syncreserve.repository.EventRepository;
import com.syncreserve.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.syncreserve.repository.ReservationRepository;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final ReservationRepository reservationRepository;

    public EventService(
            EventRepository eventRepository,
            SeatRepository seatRepository,
            ReservationRepository reservationRepository

    ) {
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
        this.reservationRepository = reservationRepository;
    }

    // ==========================================
    // CREATE EVENT
    // ==========================================

    @Transactional
    public EventResponse createEvent(CreateEventRequest request) {

        Event event = new Event();

        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());

        Event savedEvent = eventRepository.save(event);

        return mapToResponse(savedEvent);
    }

    // ==========================================
    // GET ALL EVENTS
    // ==========================================

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {

        return eventRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================================
    // GET EVENT BY ID
    // ==========================================

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long eventId) {

        Event event = findEvent(eventId);

        return mapToResponse(event);
    }

    // ==========================================
    // UPDATE EVENT
    // ==========================================

    @Transactional
    public EventResponse updateEvent(
            Long eventId,
            UpdateEventRequest request
    ) {

        Event event = findEvent(eventId);

        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());

        Event updatedEvent = eventRepository.save(event);

        return mapToResponse(updatedEvent);
    }

    // ==========================================
    // DELETE EVENT
    // ==========================================

    @Transactional
    public void deleteEvent(Long eventId) {

        Event event = findEvent(eventId);

        // Delete reservations first
        reservationRepository.deleteByEventId(eventId);

        // Delete seats
        seatRepository.deleteAll(
                seatRepository.findByEvent(event)
        );

        // Finally delete event
        eventRepository.delete(event);
    }

    // ==========================================
    // GENERATE SEATS
    // ==========================================

    @Transactional
    public void generateSeats(
            Long eventId,
            int rows,
            int seatsPerRow
    ) {

        Event event = findEvent(eventId);

        if (rows <= 0 || seatsPerRow <= 0) {
            throw new IllegalArgumentException(
                    "Rows and seats per row must be greater than zero"
            );
        }

        for (int row = 0; row < rows; row++) {

            char rowLetter = (char) ('A' + row);

            for (int number = 1; number <= seatsPerRow; number++) {

                String seatNumber =
                        rowLetter + String.valueOf(number);

                boolean exists =
                        seatRepository.existsByEventIdAndSeatNumber(
                                eventId,
                                seatNumber
                        );

                if (exists) {
                    continue;
                }

                Seat seat = new Seat();

                seat.setSeatNumber(seatNumber);
                seat.setEvent(event);

                seatRepository.save(seat);
            }
        }
    }

    // ==========================================
    // GET SEATS
    // ==========================================

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsForEvent(Long eventId) {

        Event event = findEvent(eventId);

        List<Seat> seats = seatRepository.findByEvent(event);

        return seats.stream()
                .map(seat -> new SeatResponse(
                        seat.getId(),
                        seat.getSeatNumber(),
                        false
                ))
                .toList();
    }

    // ==========================================
    // FIND EVENT
    // ==========================================

    private Event findEvent(Long eventId) {

        return eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found with id: " + eventId
                        )
                );
    }

    // ==========================================
    // MAP EVENT RESPONSE
    // ==========================================

    private EventResponse mapToResponse(Event event) {

        int totalSeats = event.getSeats().size();

        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getEventDate(),
                event.getLocation(),
                totalSeats,
                totalSeats
        );
    }
}