package com.syncreserve.service;

import com.syncreserve.dto.CreateEventRequest;
import com.syncreserve.dto.EventResponse;
import com.syncreserve.dto.SeatResponse;
import com.syncreserve.entity.Event;
import com.syncreserve.entity.Seat;
import com.syncreserve.exception.ResourceNotFoundException;
import com.syncreserve.repository.EventRepository;
import com.syncreserve.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;

    public EventService(
            EventRepository eventRepository,
            SeatRepository seatRepository
    ) {
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
    }

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

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {

        return eventRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long eventId) {

        Event event = findEvent(eventId);

        return mapToResponse(event);
    }

    @Transactional
    public void deleteEvent(Long eventId) {

        Event event = findEvent(eventId);

        eventRepository.delete(event);
    }

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

                Seat seat = new Seat();

                seat.setSeatNumber(
                        rowLetter + String.valueOf(number)
                );

                seat.setEvent(event);

                seatRepository.save(seat);
            }
        }
    }

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

    private Event findEvent(Long eventId) {

        return eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found with id: " + eventId
                        )
                );
    }

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