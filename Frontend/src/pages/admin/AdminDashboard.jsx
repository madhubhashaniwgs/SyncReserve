import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        eventsResponse,
        reservationsResponse,
        usersResponse,
      ] = await Promise.all([
        api.get("/events"),
        api.get("/reservations"),
        api.get("/admin/users"),
      ]);

      setEvents(eventsResponse.data || []);
      setReservations(reservationsResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (err) {
      console.error(
        "Failed to load admin dashboard:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalSeats = events.reduce(
    (total, event) =>
      total + Number(event.totalSeats || 0),
    0
  );

  const reservedSeats = reservations.length;

  const availableSeats = Math.max(
    totalSeats - reservedSeats,
    0
  );

  return (
    <div className="admin-dashboard-page">

      {/* ================= NAVBAR ================= */}

      <Navbar />


      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-dashboard-main">

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        ) : (
          <>

            {/* ================= HEADER ================= */}

            <section className="admin-dashboard-header">

              <div>
                <span className="admin-badge">
                  ADMIN PANEL
                </span>

                <h2>Welcome back  👋</h2>

            <h1>Admin Dashboard</h1>

                <p>
                  Monitor and manage your SyncReserve
                  platform from one place.
                </p>
              </div>

              

            </section>


            {/* ================= ERROR ================= */}

            {error && (
              <div className="admin-alert">

                <span>!</span>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={() => setError("")}
                >
                  ×
                </button>

              </div>
            )}


            {/* ================= STATISTICS ================= */}

            <section className="admin-stats">

              {/* EVENTS */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  ◈
                </div>

                <div>
                  <span>
                    TOTAL EVENTS
                  </span>

                  <strong>
                    {events.length}
                  </strong>

                  <small>
                    Events in the system
                  </small>
                </div>

              </div>


              {/* RESERVATIONS */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  ✓
                </div>

                <div>
                  <span>
                    RESERVATIONS
                  </span>

                  <strong>
                    {reservations.length}
                  </strong>

                  <small>
                    Total reservations
                  </small>
                </div>

              </div>


              {/* SEATS */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  ▦
                </div>

                <div>
                  <span>
                    TOTAL SEATS
                  </span>

                  <strong>
                    {totalSeats}
                  </strong>

                  <small>
                    Across all events
                  </small>
                </div>

              </div>


              {/* USERS */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  ♙
                </div>

                <div>
                  <span>
                    TOTAL USERS
                  </span>

                  <strong>
                    {users.length}
                  </strong>

                  <small>
                    Registered users
                  </small>
                </div>

              </div>

            </section>


            {/* ================= MANAGEMENT ================= */}

            <section className="admin-management">

              <div className="admin-section-title">

                <span>
                  CONTROL CENTER
                </span>

                <h2>
                  Management
                </h2>

              </div>


              <div className="admin-management-grid">

                {/* MANAGE USERS */}

                <Link
                  to="/admin/users"
                  className="admin-management-card"
                >

                  <div className="management-icon">
                    ♙
                  </div>

                  <div className="management-content">

                    <span>
                      USER MANAGEMENT
                    </span>

                    <h3>
                      Manage Users
                    </h3>

                    <p>
                      View users, change roles and
                      manage user accounts.
                    </p>

                  </div>

                  <div className="management-arrow">
                    →
                  </div>

                </Link>


                {/* MANAGE EVENTS */}

                <Link
                  to="/admin/events"
                  className="admin-management-card"
                >

                  <div className="management-icon">
                    ◈
                  </div>

                  <div className="management-content">

                    <span>
                      EVENT MANAGEMENT
                    </span>

                    <h3>
                      Manage Events
                    </h3>

                    <p>
                      Create, update and delete
                      events.
                    </p>

                  </div>

                  <div className="management-arrow">
                    →
                  </div>

                </Link>


                {/* MANAGE SEATS */}

                <Link
                  to="/admin/seats"
                  className="admin-management-card"
                >

                  <div className="management-icon">
                    ▦
                  </div>

                  <div className="management-content">

                    <span>
                      SEAT MANAGEMENT
                    </span>

                    <h3>
                      Manage Seats
                    </h3>

                    <p>
                      Generate and monitor event
                      seats.
                    </p>

                  </div>

                  <div className="management-arrow">
                    →
                  </div>

                </Link>


                {/* ALL RESERVATIONS */}

                <Link
                  to="/admin/reservations"
                  className="admin-management-card"
                >

                  <div className="management-icon">
                    ✓
                  </div>

                  <div className="management-content">

                    <span>
                      RESERVATION MANAGEMENT
                    </span>

                    <h3>
                      All Reservations
                    </h3>

                    <p>
                      Monitor reservations across
                      all events.
                    </p>

                  </div>

                  <div className="management-arrow">
                    →
                  </div>

                </Link>

              </div>

            </section>


            {/* ================= RECENT EVENTS ================= */}

            <section className="admin-events-section">

              <div className="admin-section-header">

                <div>

                  <span>
                    EVENT OVERVIEW
                  </span>

                  <h2>
                    Recent Events
                  </h2>

                </div>

                <Link to="/admin/events">
                  Manage Events →
                </Link>

              </div>


              {events.length === 0 ? (

                <div className="admin-empty">

                  <div>
                    ◈
                  </div>

                  <h3>
                    No events yet
                  </h3>

                  <p>
                    Create your first event to get
                    started.
                  </p>

                  <Link to="/admin/events">
                    Create Event →
                  </Link>

                </div>

              ) : (

                <div className="admin-event-table">

                  <div className="admin-event-table-header">

                    <span>
                      EVENT
                    </span>

                    <span>
                      LOCATION
                    </span>

                    <span>
                      SEATS
                    </span>

                  </div>


                  {events.slice(0, 5).map((event) => (

                    <div
                      className="admin-event-table-row"
                      key={event.id}
                    >

                      <div className="admin-event-name">

                        <div className="event-row-icon">
                          ◈
                        </div>

                        <div>

                          <strong>
                            {event.name ||
                              "Unnamed Event"}
                          </strong>

                          <small>
                            Event #{event.id}
                          </small>

                        </div>

                      </div>


                      <span>
                        {event.location ||
                          "Not specified"}
                      </span>


                      <span className="event-seat-count">
                        {event.totalSeats ?? 0}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;