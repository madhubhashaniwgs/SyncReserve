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
import com.syncreserve.entity.User;
import com.syncreserve.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import com.syncreserve.exception.UnauthorizedReservationAccessException;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            EventRepository eventRepository,
            SeatRepository seatRepository,
            UserRepository userRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
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

        User currentUser = getCurrentUser();

        Reservation reservation = new Reservation();

        reservation.setUser(currentUser);
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

        var authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        boolean isAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN")
                        );

        Reservation reservation =
                reservationRepository
                        .findById(reservationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Reservation not found"
                                )
                        );


        // ADMIN
        // Can cancel any reservation


        if (isAdmin) {
            reservationRepository.delete(reservation);
            return;
        }


        // USER
        // Can cancel only own reservation


        User currentUser = getCurrentUser();

        if (!reservation.getUser().getId()
                .equals(currentUser.getId())) {

            throw new UnauthorizedReservationAccessException(
                    "You are not allowed to cancel this reservation"
            );
        }

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

    private User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    public List<ReservationResponse> getMyReservations() {

        User currentUser = getCurrentUser();

        return reservationRepository
                .findByUserId(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}