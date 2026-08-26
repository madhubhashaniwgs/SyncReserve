import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import "./EventDetails.css";

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);

  const [selectedSeat, setSelectedSeat] = useState(null);

  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [eventResponse, seatsResponse] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/events/${eventId}/seats`),
      ]);

      setEvent(eventResponse.data);
      setSeats(seatsResponse.data || []);
    } catch (err) {
      console.error("Failed to load event:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load event details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getEventName = () => {
    if (!event) return "Event";

    return (
      event.name ||
      event.eventName ||
      event.title ||
      "Untitled Event"
    );
  };

  const getEventDescription = () => {
    if (!event) return "";

    return (
      event.description ||
      event.details ||
      "Reserve your seat for this event."
    );
  };

  const getEventDate = () => {
    if (!event) return null;

    return (
      event.date ||
      event.eventDate ||
      event.startDate ||
      event.startTime ||
      null
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSeatNumber = (seat) => {
    return (
      seat.seatNumber ||
      seat.number ||
      seat.name ||
      `Seat ${seat.id}`
    );
  };

  const isSeatReserved = (seat) => {
    return (
      seat.reserved === true ||
      seat.isReserved === true ||
      seat.status === "RESERVED" ||
      seat.status === "BOOKED"
    );
  };

  const handleSeatClick = (seat) => {
    if (isSeatReserved(seat) || reserving) {
      return;
    }

    setSuccess("");
    setSelectedSeat(seat);
  };

  const handleReserve = async () => {
    if (!selectedSeat) {
      setError("Please select a seat first.");
      return;
    }

    try {
      setReserving(true);
      setError("");
      setSuccess("");

      await api.post("/reservations", {
        eventId: Number(eventId),
        seatId: selectedSeat.id,
      });

      setSuccess(
        `Seat ${getSeatNumber(selectedSeat)} reserved successfully!`
      );

      setSelectedSeat(null);

      // Refresh seats after successful reservation.
      const seatsResponse = await api.get(
        `/events/${eventId}/seats`
      );

      setSeats(seatsResponse.data || []);

    } catch (err) {
      console.error("Reservation failed:", err);

      setError(
        err.response?.data?.message ||
        "This seat could not be reserved. It may have been reserved by another user."
      );

      // Refresh seats because another user may have
      // reserved the seat concurrently.
      try {
        const seatsResponse = await api.get(
          `/events/${eventId}/seats`
        );

        setSeats(seatsResponse.data || []);
      } catch (refreshError) {
        console.error(
          "Failed to refresh seats:",
          refreshError
        );
      }
    } finally {
      setReserving(false);
    }
  };

  const availableSeats = seats.filter(
    (seat) => !isSeatReserved(seat)
  ).length;

  const reservedSeats = seats.filter(
    (seat) => isSeatReserved(seat)
  ).length;

  if (loading) {
    return (
      <div className="event-details-page">
        <Navbar />

        <main className="event-details-main">
          <div className="event-details-loading">
            <div className="event-details-spinner"></div>
            <p>Loading event...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="event-details-page">
        <Navbar />

        <main className="event-details-main">
          <div className="event-details-error-page">
            <div className="error-page-icon">!</div>

            <h2>Unable to load event</h2>

            <p>{error}</p>

            <button
              className="back-button"
              onClick={() => navigate("/events")}
            >
              ← Back to Events
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="event-details-page">

      <Navbar />

      <main className="event-details-main">

        {/* Back */}

        <Link
          to="/events"
          className="back-to-events"
        >
          ← Back to Events
        </Link>


        {/* Event Header */}

        <section className="event-details-header">

          <div className="event-details-heading">

            <div className="event-large-icon">
              ◈
            </div>

            <div>

              <p className="event-details-label">
                EVENT DETAILS
              </p>

              <h1>
                {getEventName()}
              </h1>

              <p className="event-details-description">
                {getEventDescription()}
              </p>

            </div>

          </div>

        </section>


        {/* Alerts */}

        {error && (
          <div className="reservation-alert reservation-alert-error">

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
          <div className="reservation-alert reservation-alert-success">

            <span>✓</span>

            <p>{success}</p>

            <button
              onClick={() => setSuccess("")}
            >
              ×
            </button>

          </div>
        )}


        <div className="event-details-layout">

          {/* LEFT SIDE */}

          <section className="event-information">

            <div className="information-card">

              <h2>Event Information</h2>

              <div className="information-list">

                <div className="information-item">

                  <div className="information-icon">
                    ◷
                  </div>

                  <div>
                    <small>DATE</small>

                    <strong>
                      {formatDate(getEventDate())}
                    </strong>
                  </div>

                </div>


                {event?.location && (
                  <div className="information-item">

                    <div className="information-icon">
                      ◉
                    </div>

                    <div>
                      <small>LOCATION</small>

                      <strong>
                        {event.location}
                      </strong>
                    </div>

                  </div>
                )}

              </div>

            </div>


            {/* Seat Summary */}

            <div className="seat-summary">

              <div className="seat-summary-title">
                <h2>Seat Availability</h2>
                <span>
                  {seats.length} total
                </span>
              </div>

              <div className="seat-summary-grid">

                <div>
                  <strong>
                    {availableSeats}
                  </strong>

                  <span>
                    Available
                  </span>
                </div>

                <div>
                  <strong>
                    {reservedSeats}
                  </strong>

                  <span>
                    Reserved
                  </span>
                </div>

              </div>

            </div>

          </section>


          {/* RIGHT SIDE */}

          <section className="seat-selection-card">

            <div className="seat-selection-header">

              <div>
                <p className="event-details-label">
                  RESERVATION
                </p>

                <h2>
                  Select Your Seat
                </h2>
              </div>

              <div className="seat-legend">

                <div>
                  <span className="legend-dot available"></span>
                  Available
                </div>

                <div>
                  <span className="legend-dot selected"></span>
                  Selected
                </div>

                <div>
                  <span className="legend-dot reserved"></span>
                  Reserved
                </div>

              </div>

            </div>


            {/* Seat Area */}

            {seats.length === 0 ? (

              <div className="no-seats">
                <div>◈</div>

                <h3>
                  No seats available
                </h3>

                <p>
                  This event does not have any seats yet.
                </p>
              </div>

            ) : (

              <div className="seat-area">

                <div className="stage">
                  STAGE
                </div>

                <div className="seats-grid">

                  {seats.map((seat) => {

                    const reserved =
                      isSeatReserved(seat);

                    const selected =
                      selectedSeat?.id === seat.id;

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        className={`seat ${
                          reserved
                            ? "seat-reserved"
                            : ""
                        } ${
                          selected
                            ? "seat-selected"
                            : ""
                        }`}
                        disabled={reserved || reserving}
                        onClick={() =>
                          handleSeatClick(seat)
                        }
                      >
                        {getSeatNumber(seat)}
                      </button>
                    );
                  })}

                </div>

              </div>
            )}


            {/* Reserve */}

            <div className="reservation-footer">

              <div className="selected-seat">

                {selectedSeat ? (
                  <>
                    <small>
                      SELECTED SEAT
                    </small>

                    <strong>
                      {getSeatNumber(selectedSeat)}
                    </strong>
                  </>
                ) : (
                  <>
                    <small>
                      SEAT SELECTION
                    </small>

                    <strong className="no-selection">
                      No seat selected
                    </strong>
                  </>
                )}

              </div>


              <button
                type="button"
                className="reserve-button"
                disabled={
                  !selectedSeat || reserving
                }
                onClick={handleReserve}
              >
                {reserving
                  ? "Reserving..."
                  : "Reserve Seat →"}
              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default EventDetails;