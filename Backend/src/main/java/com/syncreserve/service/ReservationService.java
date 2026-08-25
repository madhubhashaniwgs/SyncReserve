package com.syncreserve.service;

import com.syncreserve.dto.ReservationRequest;
import com.syncreserve.entity.Event;
import com.syncreserve.entity.Reservation;
import com.syncreserve.entity.Seat;
import com.syncreserve.repository.EventRepository;
import com.syncreserve.repository.ReservationRepository;
import com.syncreserve.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.syncreserve.exception.SeatAlreadyReservedException;
import com.syncreserve.exception.ResourceNotFoundException;
import com.syncreserve.dto.ReservationResponse;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            EventRepository eventRepository,
            SeatRepository seatRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
    }

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() ->
                        new RuntimeException("Event not found")
                );

        Seat seat = seatRepository.findByIdWithLock(request.getSeatId())
                .orElseThrow(() ->
                        new RuntimeException("Seat not found")
                );

        if (!seat.getEvent().getId().equals(event.getId())) {
            throw new RuntimeException(
                    "Seat does not belong to this event"
            );
        }

        boolean alreadyReserved =
                reservationRepository.existsByEventIdAndSeatId(
                        event.getId(),
                        seat.getId()
                );

        if (alreadyReserved) {
            throw new SeatAlreadyReservedException(
                    "Seat is already reserved"
            );
        }

        Reservation reservation = new Reservation();

        reservation.setEvent(event);
        reservation.setSeat(seat);
        reservation.setReservedAt(LocalDateTime.now());

        Reservation savedReservation =
                reservationRepository.save(reservation);

        return new ReservationResponse(
                savedReservation.getId(),
                event.getId(),
                event.getName(),
                seat.getId(),
                seat.getSeatNumber(),
                savedReservation.getReservedAt()
        );
    }

    @Transactional
    public void cancelReservation(Long reservationId) {

        Reservation reservation = reservationRepository
                .findById(reservationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Reservation not found"
                        )
                );

        reservationRepository.delete(reservation);
    }


    public List<ReservationResponse> getAllReservations() {

        return reservationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReservationResponse> getReservationsByEvent(
            Long eventId
    ) {

        eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found"
                        )
                );

        return reservationRepository.findByEventId(eventId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    private ReservationResponse mapToResponse(
            Reservation reservation
    ) {

        return new ReservationResponse(
                reservation.getId(),
                reservation.getEvent().getId(),
                reservation.getEvent().getName(),
                reservation.getSeat().getId(),
                reservation.getSeat().getSeatNumber(),
                reservation.getReservedAt()
        );
    }
}