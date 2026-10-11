package com.syncreserve.repository;

import com.syncreserve.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    boolean existsByEventIdAndSeatId(
            Long eventId,
            Long seatId
    );

    List<Reservation> findByEventId(Long eventId);

        long countByEventId(Long eventId);

    List<Reservation> findByUserId(Long userId);
    void deleteByUserId(Long userId);
    void deleteByEventId(Long eventId);
}