import { useCallback, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../api/axios";
import "../../styles/EditEvent.css";
import {
  EVENT_CATEGORY_MAX_LENGTH,
  EVENT_DESCRIPTION_MAX_LENGTH,
  EVENT_LOCATION_MAX_LENGTH,
  EVENT_NAME_MAX_LENGTH,
  EVENT_VENUE_MAX_LENGTH,
  isValidFutureDate,
} from "../../utils/validation";

const EVENT_CATEGORIES = [
  "Music",
  "Sports",
  "Conference",
  "Theater",
  "Festival",
  "Exhibition",
  "Other",
];

function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    venueName: "",
    location: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    ticketPrice: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchEvent = useCallback(async () => {
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
        category: event.category || "",
        venueName: event.venueName || "",
        location: event.location || "",
        eventDate: formatDateForInput(
          event.eventDate
        ),
        startTime: formatTimeForInput(
          event.startTime
        ),
        endTime: formatTimeForInput(
          event.endTime
        ),
        ticketPrice:
          event.ticketPrice != null
            ? String(event.ticketPrice)
            : "",
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
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const formatDateForInput = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    // LocalDate serializes as "YYYY-MM-DD" - use directly.
    if (
      typeof dateValue === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ) {
      return dateValue;
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

    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (timeValue) => {
    if (!timeValue) {
      return "";
    }

    // LocalTime serializes as "HH:mm:ss" or "HH:mm".
    return String(timeValue).slice(0, 5);
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

    if (formData.name.trim().length > EVENT_NAME_MAX_LENGTH) {
      setError(`Event name must not exceed ${EVENT_NAME_MAX_LENGTH} characters.`);
      return;
    }

    if (formData.description.trim().length > EVENT_DESCRIPTION_MAX_LENGTH) {
      setError(`Description must not exceed ${EVENT_DESCRIPTION_MAX_LENGTH} characters.`);
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (formData.category.trim().length > EVENT_CATEGORY_MAX_LENGTH) {
      setError(`Category must not exceed ${EVENT_CATEGORY_MAX_LENGTH} characters.`);
      return;
    }

    if (!formData.venueName.trim()) {
      setError("Venue name is required.");
      return;
    }

    if (formData.venueName.trim().length > EVENT_VENUE_MAX_LENGTH) {
      setError(`Venue name must not exceed ${EVENT_VENUE_MAX_LENGTH} characters.`);
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required.");
      return;
    }

    if (formData.location.trim().length > EVENT_LOCATION_MAX_LENGTH) {
      setError(`Location must not exceed ${EVENT_LOCATION_MAX_LENGTH} characters.`);
      return;
    }

    if (!formData.eventDate) {
      setError("Event date is required.");
      return;
    }

    if (!isValidFutureDate(formData.eventDate)) {
      setError("Event date must be in the future.");
      return;
    }

    if (!formData.startTime) {
      setError("Start time is required.");
      return;
    }

    if (!formData.endTime) {
      setError("End time is required.");
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError("End time must be after start time.");
      return;
    }

    const ticketPrice = Number(formData.ticketPrice);

    if (
      formData.ticketPrice.trim() === "" ||
      Number.isNaN(ticketPrice) ||
      ticketPrice < 0
    ) {
      setError("Ticket price must be a valid non-negative number.");
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
          category: formData.category.trim(),
          venueName: formData.venueName.trim(),
          location: formData.location.trim(),
          eventDate: formData.eventDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          ticketPrice,
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
              maxLength={EVENT_NAME_MAX_LENGTH}
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
              maxLength={EVENT_DESCRIPTION_MAX_LENGTH}
            />

          </div>

          {/* ================= CATEGORY + VENUE ================= */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                list="event-categories"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Music, Sports, Conference"
                required
                maxLength={EVENT_CATEGORY_MAX_LENGTH}
              />

              <datalist id="event-categories">
                {EVENT_CATEGORIES.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>

            </div>

            <div className="form-group">

              <label htmlFor="venueName">
                Venue Name
              </label>

              <input
                id="venueName"
                name="venueName"
                type="text"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="e.g. BMICH Main Hall"
                required
                maxLength={EVENT_VENUE_MAX_LENGTH}
              />

            </div>

          </div>

          {/* ================= LOCATION ================= */}

          <div className="form-group">

            <label htmlFor="location">
              Location / Address
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Event location / address"
              required
              maxLength={EVENT_LOCATION_MAX_LENGTH}
            />

          </div>

          {/* ================= DATE + TICKET PRICE ================= */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="eventDate">
                Event Date
              </label>

              <input
                id="eventDate"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleChange}
                required
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
              />

            </div>

            <div className="form-group">

              <label htmlFor="ticketPrice">
                Ticket Price (LKR)
              </label>

              <input
                id="ticketPrice"
                name="ticketPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.ticketPrice}
                onChange={handleChange}
                placeholder="e.g. 1500.00"
                required
              />

            </div>

          </div>

          {/* ================= START + END TIME ================= */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="startTime">
                Start Time
              </label>

              <input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="endTime">
                End Time
              </label>

              <input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
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