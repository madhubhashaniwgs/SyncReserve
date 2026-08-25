package com.syncreserve.repository;

import com.syncreserve.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByEventIdAndSeatId(
            Long eventId,
            Long seatId
    );

    boolean existsByEventIdAndSeatId(
            Long eventId,
            Long seatId
    );
}