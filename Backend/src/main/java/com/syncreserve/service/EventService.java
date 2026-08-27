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
// GENERATE / UPDATE SEATS
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

        // ==========================================
        // STEP 1 - CREATE MISSING SEATS
        // ==========================================

        for (int row = 0; row < rows; row++) {

            String rowLabel = getRowLabel(row);

            for (int number = 1; number <= seatsPerRow; number++) {

                String seatNumber =
                        rowLabel + number;

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

        // ==========================================
        // STEP 2 - REMOVE EXTRA AVAILABLE SEATS
        // ==========================================

        List<Seat> existingSeats =
                seatRepository.findByEvent(event);

        for (Seat seat : existingSeats) {

            String seatNumber = seat.getSeatNumber();

            // Keep seats inside new configuration
            if (isSeatWithinConfiguration(
                    seatNumber,
                    rows,
                    seatsPerRow
            )) {
                continue;
            }

            // ==========================================
            // CHECK RESERVED STATUS
            // ==========================================

            boolean reserved =
                    reservationRepository.existsByEventIdAndSeatId(
                            eventId,
                            seat.getId()
                    );

            if (reserved) {

                throw new IllegalArgumentException(
                        "Cannot reduce seats because seat "
                                + seatNumber
                                + " is already reserved."
                );
            }

            // ==========================================
            // DELETE AVAILABLE EXTRA SEAT
            // ==========================================

            seatRepository.delete(seat);
        }
    }


// ==========================================
// GENERATE ROW LABEL
// A, B, C ... Z, AA, AB, AC ...
// ==========================================

    private String getRowLabel(int rowIndex) {

        StringBuilder label = new StringBuilder();

        int number = rowIndex + 1;

        while (number > 0) {

            number--;

            label.insert(
                    0,
                    (char) ('A' + (number % 26))
            );

            number /= 26;
        }

        return label.toString();
    }


// ==========================================
// CHECK SEAT CONFIGURATION
// Supports:
// A1
// Z10
// AA1
// AB20
// AAA50
// ==========================================

    private boolean isSeatWithinConfiguration(
            String seatNumber,
            int rows,
            int seatsPerRow
    ) {

        if (seatNumber == null || seatNumber.length() < 2) {
            return false;
        }

        // ==========================================
        // SEPARATE ROW LABEL AND SEAT NUMBER
        // ==========================================

        int splitIndex = 0;

        while (
                splitIndex < seatNumber.length()
                        && Character.isLetter(
                        seatNumber.charAt(splitIndex)
                )
        ) {
            splitIndex++;
        }

        if (splitIndex == 0 || splitIndex == seatNumber.length()) {
            return false;
        }

        String rowLabel =
                seatNumber.substring(0, splitIndex);

        String seatNumberPart =
                seatNumber.substring(splitIndex);

        int seatNumberValue;

        try {

            seatNumberValue =
                    Integer.parseInt(seatNumberPart);

        } catch (NumberFormatException e) {

            return false;
        }

        // ==========================================
        // CONVERT ROW LABEL TO ROW INDEX
        // ==========================================

        int rowIndex = getRowIndex(rowLabel);

        return rowIndex >= 0
                && rowIndex < rows
                && seatNumberValue >= 1
                && seatNumberValue <= seatsPerRow;
    }


// ==========================================
// CONVERT ROW LABEL TO INDEX
// A  -> 0
// B  -> 1
// Z  -> 25
// AA -> 26
// AB -> 27
// ==========================================

    private int getRowIndex(String rowLabel) {

        int result = 0;

        for (int i = 0; i < rowLabel.length(); i++) {

            char character =
                    Character.toUpperCase(
                            rowLabel.charAt(i)
                    );

            if (character < 'A' || character > 'Z') {
                return -1;
            }

            result =
                    result * 26
                            + (character - 'A' + 1);
        }

        return result - 1;
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
                        reservationRepository.existsByEventIdAndSeatId(
                                eventId,
                                seat.getId()
                        )
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