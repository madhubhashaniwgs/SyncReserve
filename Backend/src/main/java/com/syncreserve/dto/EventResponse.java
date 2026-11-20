package com.syncreserve.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class EventResponse {

    private Long id;
    private String name;
    private String description;
    private String category;
    private String venueName;
    private String location;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal ticketPrice;
    private int totalSeats;
    private int availableSeats;

    public EventResponse() {
    }

    public EventResponse(
            Long id,
            String name,
            String description,
            String category,
            String venueName,
            String location,
            LocalDate eventDate,
            LocalTime startTime,
            LocalTime endTime,
            BigDecimal ticketPrice,
            int totalSeats,
            int availableSeats
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.venueName = venueName;
        this.location = location;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.ticketPrice = ticketPrice;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getVenueName() {
        return venueName;
    }

    public String getLocation() {
        return location;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }
}
