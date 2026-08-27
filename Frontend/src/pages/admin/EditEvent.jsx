import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../api/axios";
import "./EditEvent.css";

function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventDate: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/events/${eventId}`
      );

      const event = response.data;

      setFormData({
        name: event.name || "",
        description: event.description || "",
        eventDate: formatDateForInput(
          event.eventDate
        ),
        location: event.location || "",
      });
    } catch (err) {
      console.error(
        "Failed to load event:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load event."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const hours = String(
      date.getHours()
    ).padStart(2, "0");

    const minutes = String(
      date.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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
      setSaving(true);
      setError("");

      await api.put(
        `/events/${eventId}`,
        {
          name: formData.name.trim(),
          description:
            formData.description.trim(),
          eventDate: formData.eventDate,
          location: formData.location.trim(),
        }
      );

      navigate("/admin/events", {
        state: {
          success:
            "Event updated successfully.",
        },
      });
    } catch (err) {
      console.error(
        "Failed to update event:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update event."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="edit-event-main">

        <div className="edit-event-loading">

          <div className="edit-event-spinner"></div>

          <p>
            Loading event...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="edit-event-main">

      {/* ================= HEADER ================= */}

      <div className="edit-event-header">

        <div>
          <p className="admin-label">
            ADMINISTRATION
          </p>

          <h1>Edit Event</h1>

          <p>
            Update event information in
            SyncReserve.
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
        <div className="edit-event-alert">

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

      {/* ================= FORM ================= */}

      <section className="edit-event-card">

        <div className="edit-event-card-header">

          <div>

            <p className="admin-label">
              EVENT #{eventId}
            </p>

            <h2>
              Event Information
            </h2>

            <p>
              Modify the details of this event.
            </p>

          </div>

        </div>

        <form
          className="edit-event-form"
          onSubmit={handleSubmit}
        >

          {/* ================= NAME ================= */}

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
              placeholder="Event name"
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
              placeholder="Event description..."
            />

          </div>

          {/* ================= DATE / LOCATION ================= */}

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
                placeholder="Event location"
                required
              />

            </div>

          </div>

          {/* ================= ACTIONS ================= */}

          <div className="edit-event-actions">

            <Link
              to="/admin/events"
              className="cancel-event-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="save-event-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default EditEvent;