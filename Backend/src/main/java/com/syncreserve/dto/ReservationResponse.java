package com.syncreserve.dto;

import java.time.LocalDateTime;

public class ReservationResponse {

    private Long reservationId;
    private Long eventId;
    private String eventName;
    private Long seatId;
    private String seatNumber;
    private LocalDateTime reservedAt;

    public ReservationResponse(
            Long reservationId,
            Long eventId,
            String eventName,
            Long seatId,
            String seatNumber,
            LocalDateTime reservedAt
    ) {
        this.reservationId = reservationId;
        this.eventId = eventId;
        this.eventName = eventName;
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.reservedAt = reservedAt;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public Long getEventId() {
        return eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public Long getSeatId() {
        return seatId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public LocalDateTime getReservedAt() {
        return reservedAt;
    }
}