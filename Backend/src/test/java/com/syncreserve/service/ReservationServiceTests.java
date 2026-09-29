package com.syncreserve.service;

import com.syncreserve.dto.ReservationRequest;
import com.syncreserve.entity.Event;
import com.syncreserve.entity.Reservation;
import com.syncreserve.entity.Seat;
import com.syncreserve.entity.User;
import com.syncreserve.exception.SeatAlreadyReservedException;
import com.syncreserve.exception.UnauthorizedReservationAccessException;
import com.syncreserve.repository.EventRepository;
import com.syncreserve.repository.ReservationRepository;
import com.syncreserve.repository.SeatRepository;
import com.syncreserve.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTests {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private UserRepository userRepository;

    private ReservationService reservationService;

    @BeforeEach
    void setUp() {
        reservationService = new ReservationService(
                reservationRepository,
                eventRepository,
                seatRepository,
                userRepository
        );
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void rejectsReservationWhenSeatIsAlreadyReserved() {
        Event event = event(1L);
        Seat seat = seat(10L, event);
        ReservationRequest request = request(1L, 10L);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(seatRepository.findByIdWithLock(10L)).thenReturn(Optional.of(seat));
        when(reservationRepository.existsByEventIdAndSeatId(1L, 10L))
                .thenReturn(true);

        assertThrows(
                SeatAlreadyReservedException.class,
                () -> reservationService.createReservation(request)
        );

        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    @Test
    void preventsUserFromCancellingAnotherUsersReservation() {
        User owner = user(1L, "owner@example.com");
        User currentUser = user(2L, "current@example.com");
        Reservation reservation = new Reservation();
        reservation.setUser(owner);

        authenticate("current@example.com", "ROLE_USER");
        when(reservationRepository.findById(20L))
                .thenReturn(Optional.of(reservation));
        when(userRepository.findByEmail("current@example.com"))
                .thenReturn(Optional.of(currentUser));

        assertThrows(
                UnauthorizedReservationAccessException.class,
                () -> reservationService.cancelReservation(20L)
        );

        verify(reservationRepository, never()).delete(any(Reservation.class));
    }

    @Test
    void allowsAdminToCancelAnyReservation() {
        Reservation reservation = new Reservation();

        authenticate("admin@example.com", "ROLE_ADMIN");
        when(reservationRepository.findById(20L))
                .thenReturn(Optional.of(reservation));

        reservationService.cancelReservation(20L);

        verify(reservationRepository).delete(reservation);
    }

    private ReservationRequest request(Long eventId, Long seatId) {
        ReservationRequest request = new ReservationRequest();
        request.setEventId(eventId);
        request.setSeatId(seatId);
        return request;
    }

    private Event event(Long id) {
        Event event = new Event();
        setId(event, id);
        return event;
    }

    private Seat seat(Long id, Event event) {
        Seat seat = new Seat();
        setId(seat, id);
        seat.setSeatNumber("A1");
        seat.setEvent(event);
        return seat;
    }

    private User user(Long id, String email) {
        User user = new User();
        setId(user, id);
        user.setEmail(email);
        return user;
    }

    private void authenticate(String email, String role) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of(new SimpleGrantedAuthority(role))
                )
        );
    }

    private void setId(Object entity, Long id) {
        try {
            var field = entity.getClass().getDeclaredField("id");
            field.setAccessible(true);
            field.set(entity, id);
        } catch (ReflectiveOperationException exception) {
            throw new AssertionError("Unable to set test entity ID", exception);
        }
    }
}
