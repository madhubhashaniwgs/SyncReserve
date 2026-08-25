package com.syncreserve.exception;

public class UnauthorizedReservationAccessException
        extends RuntimeException {

    public UnauthorizedReservationAccessException(
            String message
    ) {
        super(message);
    }
}