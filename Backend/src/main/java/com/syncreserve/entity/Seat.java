package com.syncreserve.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.*;

@Entity
@Table(
        name = "seats",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_event_seat_number",
                        columnNames = {"event_id", "seat_number"}
                )
        }
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore
    private Event event;

    @OneToMany(
            mappedBy = "seat",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private java.util.List<Reservation> reservations =
            new java.util.ArrayList<>();

    public Seat() {
    }

    public Long getId() {
        return id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public java.util.List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(
            java.util.List<Reservation> reservations
    ) {
        this.reservations = reservations;
    }
}