import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import "./Reservations.css";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reservations/my");

      setReservations(response.data || []);
    } catch (err) {
      console.error("Failed to load reservations:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load your reservations."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(reservationId);
      setError("");
      setSuccess("");

      await api.delete(
        `/reservations/${reservationId}`
      );

      setReservations((currentReservations) =>
          currentReservations.filter(
            (reservation) =>
              reservation.reservationId !== reservationId
          )
        );

      setSuccess(
        "Reservation cancelled successfully."
      );
    } catch (err) {
      console.error(
        "Failed to cancel reservation:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to cancel reservation."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getEventName = (reservation) => {
    return (
      reservation.eventName ||
      reservation.event?.name ||
      reservation.event?.title ||
      `Event #${reservation.eventId}`
    );
  };

  const getSeatName = (reservation) => {
    return (
      reservation.seatNumber ||
      reservation.seatName ||
      reservation.seat?.seatNumber ||
      reservation.seat?.number ||
      `Seat #${reservation.seatId}`
    );
  };

  

  const formatDate = (date) => {
  if (!date) {
    return "Date not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  return (
    <div className="reservations-page">

      <Navbar />

      <main className="reservations-main">

        {/* Header */}

        <div className="reservations-header">

          <div>
            <p className="reservations-label">
              RESERVATIONS
            </p>

            <h1>
              My Reservations
            </h1>

            <p>
              View and manage your reserved seats.
            </p>
          </div>

          <Link
            to="/events"
            className="browse-events-button"
          >
            Browse Events →
          </Link>

        </div>


        {/* Alerts */}

        {error && (
          <div className="reservation-page-alert error">

            <span>!</span>

            <p>{error}</p>

            <button
              onClick={() => setError("")}
            >
              ×
            </button>

          </div>
        )}


        {success && (
          <div className="reservation-page-alert success">

            <span>✓</span>

            <p>{success}</p>

            <button
              onClick={() => setSuccess("")}
            >
              ×
            </button>

          </div>
        )}


        {/* Loading */}

        {loading ? (

          <div className="reservations-loading">

            <div className="reservations-spinner"></div>

            <p>
              Loading your reservations...
            </p>

          </div>

        ) : reservations.length === 0 ? (

          /* Empty */

          <div className="reservations-empty">

            <div className="empty-reservation-icon">
              ▣
            </div>

            <h2>
              No reservations yet
            </h2>

            <p>
              You haven't reserved any seats yet.
              Explore upcoming events and reserve
              your favorite seat.
            </p>

            <Link
              to="/events"
              className="empty-browse-button"
            >
              Explore Events →
            </Link>

          </div>

        ) : (

          /* Reservation List */

          <div className="reservations-content">

            <div className="reservations-summary">

              <div>
                <span>
                  TOTAL RESERVATIONS
                </span>

                <strong>
                  {reservations.length}
                </strong>
              </div>

              <div className="summary-icon">
                ✓
              </div>

            </div>


            <div className="reservation-list">

              {reservations.map((reservation, index) => (
                <article
                    className="reservation-card"
                    key={
                      reservation.reservationId ??
                      `reservation-${index}`
                    }
                  >

                  {/* Event Icon */}
                  <div className="reservation-event-icon">
                    ◈
                  </div>

                  {/* Reservation Information */}
                  <div className="reservation-info">

                    {/* Title */}
                    <div className="reservation-title-row">

                      <div>
                        <h2><p className="reservation-event-label">
                          {reservation.eventName ||
                            `Event #${reservation.eventId}`}
                        </p> </h2>

                        
                          
                       
                      </div>

                      <span className="reservation-status">
                        ACTIVE
                      </span>

                    </div>


                    {/* Details */}
                    <div className="reservation-details">

                      {/* Event ID */}
                      <div className="reservation-detail-item">

                        <small>
                          EVENT ID
                        </small>

                        <strong>
                          #{reservation.eventId}
                        </strong>

                      </div>


                      {/* Seat */}
                      <div className="reservation-detail-item">

                        <small>
                          SEAT
                        </small>

                        <strong className="seat-value">
                          {reservation.seatNumber ||
                            `Seat #${reservation.seatId}`}
                        </strong>

                      </div>



                      {/* Created At */}
                      <div className="reservation-detail-item">

                        <small>
                          RESERVED ON
                        </small>

                        <strong>
                          {formatDate(reservation.reservedAt)}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* Cancel */}
                  <button
                    type="button"
                    className="cancel-reservation-button"
                    disabled={
                       cancellingId === reservation.reservationId
                    }
                    onClick={() =>
                      handleCancel(reservation.reservationId)
                    }
                  >
                    {cancellingId === reservation.reservationId
                      ? "Cancelling..."
                      : "Cancel"}
                  </button>

                </article>
              ))}

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default Reservations;