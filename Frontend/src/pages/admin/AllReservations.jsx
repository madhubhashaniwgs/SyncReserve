import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "./AllReservations.css";

function AllReservations() {

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/reservations");

      setReservations(response.data || []);

    } catch (err) {

      console.error(
        "Failed to load reservations:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load reservations."
      );

    } finally {

      setLoading(false);

    }
  };


  const getStatus = (reservation) => {

    return (
      reservation.status ||
      "CONFIRMED"
    ).toUpperCase();

  };


  const getStatusClass = (status) => {

    if (status === "CANCELLED") {
      return "reservation-status-cancelled";
    }

    if (status === "CONFIRMED") {
      return "reservation-status-confirmed";
    }

    return "reservation-status-default";
  };


  return (

    <main className="all-reservations-main">

      {/* ================= HEADER ================= */}

      <div className="all-reservations-header">

        <div>

          <p className="admin-label">
            ADMINISTRATION
          </p>

          <h1>
            All Reservations
          </h1>

          <p>
            Monitor all reservations made across SyncReserve.
          </p>

        </div>


        <Link
          to="/admin"
          className="back-admin-button"
        >
          ← Admin Dashboard
        </Link>

      </div>


      {/* ================= ERROR ================= */}

      {error && (

        <div className="admin-alert">

          <span>!</span>

          <p>{error}</p>

          <button
            onClick={() => setError("")}
          >
            ×
          </button>

        </div>

      )}


      {/* ================= SUMMARY ================= */}

      {!loading && !error && (

        <div className="reservations-summary-card">

          <div className="reservation-summary-item">

            <span>
              Total Reservations
            </span>

            <strong>
              {reservations.length}
            </strong>

          </div>


          <div className="reservation-summary-item">

            <span>
              Confirmed
            </span>

            <strong>
              {
                reservations.filter(
                  (reservation) =>
                    getStatus(reservation) ===
                    "CONFIRMED"
                ).length
              }
            </strong>

          </div>


          <div className="reservation-summary-item">

            <span>
              Cancelled
            </span>

            <strong>
              {
                reservations.filter(
                  (reservation) =>
                    getStatus(reservation) ===
                    "CANCELLED"
                ).length
              }
            </strong>

          </div>

        </div>

      )}


      {/* ================= RESERVATIONS ================= */}

      <section className="reservations-management-section">

        <div className="reservations-section-header">

          <div>

            <p className="admin-label">
              RESERVATION MANAGEMENT
            </p>

            <h2>
              Reservation Records
            </h2>

          </div>


          <div className="reservation-count">
            {reservations.length} reservations
          </div>

        </div>


        {loading ? (

          <div className="admin-loading">

            <div className="admin-spinner"></div>

            <p>
              Loading reservations...
            </p>

          </div>

        ) : reservations.length === 0 ? (

          <div className="admin-empty">

            <h3>
              No reservations found
            </h3>

            <p>
              There are currently no reservations in the system.
            </p>

          </div>

        ) : (

          <div className="reservations-list">

            {reservations.map((reservation) => {

              const status =
                getStatus(reservation);

              return (

                <article
                  className="reservation-card"
                  key={reservation.reservationId}
                >

                  <div className="reservation-icon">
                    ◈
                  </div>


                  <div className="reservation-info">

                    <p>
                      RESERVATION #{reservation.reservationId }
                    </p>

                    <h3>
                      {reservation.eventName ||
                        reservation.event?.name ||
                        `Event #${
                          reservation.eventId || "-"
                        }`}
                    </h3>

                    <div className="reservation-details">

                      <span>
                        💺{" "}
                        {reservation.seatNumber ||
                          reservation.seat?.seatNumber ||
                          `Seat ${
                            reservation.seatId || "-"
                          }`}
                      </span>

                      <span>
                        👤{" "}
                        {reservation.userName ||
                          reservation.user?.name ||
                          `User ${
                            reservation.userId || "-"
                          }`}
                      </span>

                      <span>
                        ✉{" "}
                        {reservation.userEmail ||
                          reservation.user?.email ||
                          "No email"}
                      </span>

                    </div>

                  </div>


                  <div className="reservation-status-wrapper">

                    <span
                      className={`reservation-status ${
                        getStatusClass(status)
                      }`}
                    >
                      {status}
                    </span>

                  </div>

                </article>

              );

            })}

          </div>

        )}

      </section>

    </main>

  );
}

export default AllReservations;