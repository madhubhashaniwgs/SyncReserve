package com.syncreserve.repository;

import com.syncreserve.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    boolean existsByEventIdAndSeatId(
            Long eventId,
            Long seatId
    );

    List<Reservation> findByEventId(Long eventId);
}