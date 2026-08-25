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
    public Reservation createReservation(ReservationRequest request) {

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

        return reservationRepository.save(reservation);
    }
}