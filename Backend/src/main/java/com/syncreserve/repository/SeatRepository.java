package com.syncreserve.repository;

import com.syncreserve.entity.Event;
import com.syncreserve.entity.Seat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByEvent(Event event);

    Optional<Seat> findByIdAndEventId(Long id, Long eventId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT s
            FROM Seat s
            WHERE s.id = :seatId
            """)
    Optional<Seat> findByIdWithLock(
            @Param("seatId") Long seatId
    );
}