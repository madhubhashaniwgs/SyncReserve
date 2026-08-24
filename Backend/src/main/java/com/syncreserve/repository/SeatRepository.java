package com.syncreserve.repository;

import com.syncreserve.entity.Event;
import com.syncreserve.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByEvent(Event event);

    Optional<Seat> findByIdAndEventId(Long id, Long eventId);
}