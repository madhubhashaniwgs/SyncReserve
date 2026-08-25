package com.syncreserve.dto;

public class SeatResponse {

    private Long id;
    private String seatNumber;
    private boolean reserved;

    public SeatResponse() {
    }

    public SeatResponse(Long id, String seatNumber, boolean reserved) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.reserved = reserved;
    }

    public Long getId() {
        return id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public boolean isReserved() {
        return reserved;
    }
}