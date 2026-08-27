import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "./ManageEvents.css";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      console.error(
        "Failed to load events:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/events/${eventId}`
      );

      setEvents((currentEvents) =>
        currentEvents.filter(
          (event) => event.id !== eventId
        )
      );

      setSuccess(
        "Event deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete event:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete event."
      );
    }
  };

  return (
    <main className="manage-events-main">

      <div className="manage-events-header">

        <div>
          <p className="admin-label">
            ADMINISTRATION
          </p>

          <h1>Manage Events</h1>

          <p>
            View and manage events in SyncReserve.
          </p>
        </div>


        <div className="manage-events-actions">

          <Link
            to="/admin"
            className="back-admin-button"
          >
            ← Admin Dashboard
          </Link>

          <Link
            to="/admin/events/create"
            className="create-event-button"
          >
            + Create Event
          </Link>

        </div>

      </div>


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


      {success && (
        <div className="admin-success">
          <span>✓</span>
          <p>{success}</p>

          <button
            onClick={() => setSuccess("")}
          >
            ×
          </button>
        </div>
      )}


      {loading ? (

        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Loading events...</p>
        </div>

      ) : events.length === 0 ? (

        <div className="admin-empty">

          <h2>No events available</h2>

          <p>
            There are currently no events in the system.
          </p>

          <Link
            to="/admin/events/create"
            className="create-event-button"
          >
            Create Event
          </Link>

        </div>

      ) : (

        <div className="manage-events-list">

          {events.map((event) => (

            <article
              className="manage-event-card"
              key={event.id}
            >

              <div className="manage-event-icon">
                ◈
              </div>


              <div className="manage-event-info">

                <p>
                  EVENT #{event.id}
                </p>

                <h2>
                  {event.name ||
                    "Unnamed Event"}
                </h2>

                <div className="manage-event-details">

                  <span>
                    📍{" "}
                    {event.location ||
                      "Location not specified"}
                  </span>

                  <span>
                    💺{" "}
                    {event.totalSeats ?? 0}
                    {" "}seats
                  </span>

                </div>

              </div>


              <div className="manage-event-actions">

                <Link
                  to={`/events/${event.id}`}
                  className="view-event-button"
                >
                  View
                </Link>

                <Link
                  to={`/admin/events/edit/${event.id}`}
                  className="edit-event-button"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  className="delete-event-button"
                  onClick={() =>
                    handleDelete(event.id)
                  }
                >
                  Delete
                </button>

              </div>

            </article>

          ))}

        </div>

      )}

    </main>
  );
}

export default ManageEvents;