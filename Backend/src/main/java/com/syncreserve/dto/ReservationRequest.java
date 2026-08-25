package com.syncreserve.dto;

import jakarta.validation.constraints.NotNull;

public class ReservationRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Seat ID is required")
    private Long seatId;

    public ReservationRequest() {
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }
}