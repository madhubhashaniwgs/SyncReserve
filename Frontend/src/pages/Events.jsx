import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/events");

      setEvents(response.data || []);
    } catch (err) {
      console.error("Failed to load events:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getEventName = (event) => {
    return (
      event.name ||
      event.eventName ||
      event.title ||
      "Untitled Event"
    );
  };

  const getEventDescription = (event) => {
    return (
      event.description ||
      event.details ||
      "Discover this event and reserve your seat."
    );
  };

  const getEventDate = (event) => {
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
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="events-page">

      <Navbar />

      <main className="events-main">

        {/* Header */}

        <header className="events-header">

          <div>
            <p className="events-label">
              DISCOVER
            </p>

            <h1>
              Upcoming Events
            </h1>

            <p className="events-description">
              Explore available events and reserve
              your perfect seat.
            </p>
          </div>

          <div className="events-count">
            <span>AVAILABLE</span>
            <strong>
              {loading ? "—" : events.length}
            </strong>
          </div>

        </header>


        {/* Error */}

        {error && (
          <div className="events-error">

            <div className="events-error-icon">
              !
            </div>

            <div>
              <strong>
                Unable to load events
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              onClick={fetchEvents}
              className="events-retry"
            >
              Retry
            </button>

          </div>
        )}


        {/* Loading */}

        {loading && (
          <div className="events-loading">

            <div className="events-spinner"></div>

            <p>
              Loading events...
            </p>

          </div>
        )}


        {/* Empty */}

        {!loading &&
          !error &&
          events.length === 0 && (

            <div className="events-empty">

              <div className="events-empty-icon">
                ◈
              </div>

              <h2>
                No events available
              </h2>

              <p>
                There are currently no upcoming events.
                Please check again later.
              </p>

            </div>
          )}


        {/* Event Cards */}

        {!loading &&
          !error &&
          events.length > 0 && (

            <section className="events-grid">

              {events.map((event) => (

                <article
                  className="event-card"
                  key={event.id}
                >

                  <div className="event-card-top">

                    <div className="event-card-icon">
                      ◈
                    </div>

                    <span className="event-status">
                      AVAILABLE
                    </span>

                  </div>


                  <div className="event-card-content">

                    <h2>
                      {getEventName(event)}
                    </h2>

                    <p className="event-card-description">
                      {getEventDescription(event)}
                    </p>


                    <div className="event-meta">

                      <div className="event-meta-item">

                        <span className="meta-icon">
                          ◷
                        </span>

                        <div>
                          <small>
                            DATE
                          </small>

                          <strong>
                            {formatDate(
                              getEventDate(event)
                            )}
                          </strong>
                        </div>

                      </div>


                      {event.location && (
                        <div className="event-meta-item">

                          <span className="meta-icon">
                            ◉
                          </span>

                          <div>
                            <small>
                              LOCATION
                            </small>

                            <strong>
                              {event.location}
                            </strong>
                          </div>

                        </div>
                      )}

                    </div>

                  </div>


                  <Link
                    to={`/events/${event.id}`}
                    className="event-details-button"
                  >
                    View Event
                    <span>→</span>
                  </Link>

                </article>

              ))}

            </section>
          )}

      </main>

    </div>
  );
}

export default Events;