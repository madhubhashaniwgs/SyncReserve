import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [eventsResponse, reservationsResponse] =
        await Promise.all([
          api.get("/events"),
          api.get("/reservations/my"),
        ]);

      setEvents(eventsResponse.data || []);
      setReservations(reservationsResponse.data || []);
    } catch (err) {
      console.error("Dashboard data loading failed:", err);

      setError(
        "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Backend response field names may vary slightly.
   * These helpers make the dashboard more flexible.
   */

  const getEventName = (event) => {
    return (
      event.name ||
      event.eventName ||
      event.title ||
      "Untitled Event"
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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /*
   * Show only a few events on Dashboard.
   * Full event list will be available on Events page.
   */

  const upcomingEvents = events.slice(0, 3);

  /*
   * At the moment reservations returned by the backend
   * represent the user's reservations.
   *
   * If status exists, count only active ones.
   */

  const activeReservations = reservations.filter(
    (reservation) => {
      if (!reservation.status) {
        return true;
      }

      return (
        reservation.status.toUpperCase() === "ACTIVE" ||
        reservation.status.toUpperCase() === "CONFIRMED"
      );
    }
  );

  return (
    <div className="dashboard-page">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <Navbar />


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="dashboard-main">

        {/* =========================================
            HEADER
        ========================================= */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-label">
              USER DASHBOARD
            </p>

            <h1>
              Welcome back, {user?.name || "User"} 👋
            </h1>

            <p className="dashboard-description">
              Manage your reservations and discover
              upcoming events.
            </p>

          </div>

          <Link
            to="/events"
            className="browse-button"
          >
            Browse Events
            <span>→</span>
          </Link>

        </header>


        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="dashboard-error">

            <div className="dashboard-error-icon">
              !
            </div>

            <div>
              <strong>
                Something went wrong
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              className="retry-button"
            >
              Retry
            </button>

          </div>
        )}


        {/* =========================================
            STATISTICS
        ========================================= */}

        <section className="stats-grid">

          {/* My Reservations */}

          <div className="stat-card">

            <div className="stat-card-icon">
              ▣
            </div>

            <div>

              <p>
                My Reservations
              </p>

              <h2>
                {loading ? "—" : reservations.length}
              </h2>

            </div>

          </div>


          {/* Events */}

          <div className="stat-card">

            <div className="stat-card-icon">
              ◈
            </div>

            <div>

              <p>
                Upcoming Events
              </p>

              <h2>
                {loading ? "—" : events.length}
              </h2>

            </div>

          </div>


          {/* Active Reservations */}

          <div className="stat-card">

            <div className="stat-card-icon">
              ✓
            </div>

            <div>

              <p>
                Active Reservations
              </p>

              <h2>
                {loading
                  ? "—"
                  : activeReservations.length}
              </h2>

            </div>

          </div>

        </section>


        {/* =========================================
            QUICK ACTIONS
        ========================================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <p className="dashboard-label">
                QUICK ACTIONS
              </p>

              <h2>
                What would you like to do?
              </h2>

            </div>

          </div>


          <div className="quick-actions">

            <Link
              to="/events"
              className="action-card"
            >

              <div className="action-icon">
                ◈
              </div>

              <div className="action-content">

                <h3>
                  Browse Events
                </h3>

                <p>
                  Explore upcoming events and find
                  the perfect seat.
                </p>

              </div>

              <span className="action-arrow">
                →
              </span>

            </Link>


            <Link
              to="/reservations"
              className="action-card"
            >

              <div className="action-icon">
                ▣
              </div>

              <div className="action-content">

                <h3>
                  My Reservations
                </h3>

                <p>
                  View and manage all your current
                  reservations.
                </p>

              </div>

              <span className="action-arrow">
                →
              </span>

            </Link>

          </div>

        </section>


        {/* =========================================
            UPCOMING EVENTS
        ========================================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <p className="dashboard-label">
                DISCOVER
              </p>

              <h2>
                Upcoming Events
              </h2>

            </div>

            <Link
              to="/events"
              className="view-all"
            >
              View all →
            </Link>

          </div>


          {/* Loading */}

          {loading && (
            <div className="events-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading events...
              </p>

            </div>
          )}


          {/* Empty */}

          {!loading &&
            !error &&
            upcomingEvents.length === 0 && (

              <div className="empty-events">

                <div className="empty-icon">
                  ◈
                </div>

                <h3>
                  No upcoming events
                </h3>

                <p>
                  New events will appear here when
                  they become available.
                </p>

                <Link
                  to="/events"
                  className="empty-button"
                >
                  Explore Events
                </Link>

              </div>
            )}


          {/* Events */}

          {!loading &&
            !error &&
            upcomingEvents.length > 0 && (

              <div className="dashboard-events">

                {upcomingEvents.map((event) => (

                  <div
                    className="dashboard-event-card"
                    key={event.id}
                  >

                    <div className="event-date">

                      <span>
                        EVENT
                      </span>

                      <strong>
                        {formatDate(
                          getEventDate(event)
                        )}
                      </strong>

                    </div>


                    <div className="event-info">

                      <h3>
                        {getEventName(event)}
                      </h3>

                      {event.location && (
                        <p>
                          {event.location}
                        </p>
                      )}

                    </div>


                    <Link
                      to={`/events/${event.id}`}
                      className="event-view-button"
                    >
                      View Event
                      <span>→</span>
                    </Link>

                  </div>

                ))}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;