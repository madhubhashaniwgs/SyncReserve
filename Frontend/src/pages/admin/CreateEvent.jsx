import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./CreateEvent.css";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventDate: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Event name is required.");
      return;
    }

    if (!formData.eventDate) {
      setError("Event date is required.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/events", {
        name: formData.name.trim(),
        description: formData.description.trim(),
        eventDate: formData.eventDate,
        location: formData.location.trim(),
      });

      navigate("/admin/events", {
        state: {
          success: "Event created successfully.",
        },
      });
    } catch (err) {
      console.error("Failed to create event:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-event-main">

      {/* ================= HEADER ================= */}

      <div className="create-event-header">

        <div>
          <p className="admin-label">
            ADMINISTRATION
          </p>

          <h1>Create Event</h1>

          <p>
            Create a new event for SyncReserve.
          </p>
        </div>

        <Link
          to="/admin/events"
          className="back-admin-button"
        >
          ← Manage Events
        </Link>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="create-event-alert">
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

      {/* ================= FORM CARD ================= */}

      <section className="create-event-card">

        <div className="create-event-card-header">

          <div>
            <p className="admin-label">
              EVENT DETAILS
            </p>

            <h2>
              Event Information
            </h2>

            <p>
              Enter the basic information for
              your new event.
            </p>
          </div>

        </div>

        <form
          className="create-event-form"
          onSubmit={handleSubmit}
        >

          {/* ================= EVENT NAME ================= */}

          <div className="form-group">

            <label htmlFor="name">
              Event Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Colombo Music Festival"
              required
            />

          </div>

          {/* ================= DESCRIPTION ================= */}

          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
            />

          </div>

          {/* ================= DATE + LOCATION ================= */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="eventDate">
                Event Date
              </label>

              <input
                id="eventDate"
                name="eventDate"
                type="datetime-local"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. BMICH, Colombo"
                required
              />

            </div>

          </div>

          {/* ================= ACTIONS ================= */}

          <div className="create-event-actions">

            <Link
              to="/admin/events"
              className="cancel-event-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="save-event-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Event"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default CreateEvent;