import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "./ManageSeats.css";

function ManageSeats() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  const [seats, setSeats] = useState([]);

  // New configuration
  const [rows, setRows] = useState("");
  const [seatsPerRow, setSeatsPerRow] = useState("");

  // Current configuration
  const [currentRows, setCurrentRows] = useState(0);
  const [currentSeatsPerRow, setCurrentSeatsPerRow] = useState(0);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD EVENTS
  // ==========================================

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      setError("");

      const response = await api.get("/events");

      setEvents(response.data || []);
    } catch (err) {
      console.error("Failed to load events:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load events."
      );
    } finally {
      setLoadingEvents(false);
    }
  };

  // ==========================================
  // GET SEAT NUMBER
  // ==========================================

  const getSeatNumber = (seat) => {
    return (
      seat.seatNumber ||
      seat.number ||
      seat.name ||
      `Seat ${seat.id}`
    );
  };

  // ==========================================
  // CONVERT ROW LABEL TO INDEX
  //
  // A  -> 0
  // B  -> 1
  // Z  -> 25
  // AA -> 26
  // AB -> 27
  // ==========================================

  const getRowIndex = (rowLabel) => {
    if (!rowLabel) {
      return -1;
    }

    let result = 0;

    for (let i = 0; i < rowLabel.length; i++) {
      const character = rowLabel
        .charAt(i)
        .toUpperCase();

      if (character < "A" || character > "Z") {
        return -1;
      }

      result =
        result * 26 +
        (character.charCodeAt(0) -
          "A".charCodeAt(0) +
          1);
    }

    return result - 1;
  };

  // ==========================================
  // GET ROW LABEL FROM SEAT NUMBER
  //
  // A1  -> A
  // AA1 -> AA
  // ==========================================

  const getRowLabel = (seatNumber) => {
    if (!seatNumber) {
      return "";
    }

    const match = String(seatNumber).match(
      /^[A-Za-z]+/
    );

    return match ? match[0].toUpperCase() : "";
  };

  // ==========================================
  // GET SEAT NUMBER PART
  //
  // A1  -> 1
  // AA25 -> 25
  // ==========================================

  const getSeatNumberValue = (seatNumber) => {
    if (!seatNumber) {
      return 0;
    }

    const getRowLabel = (seatNumber) => {
      return seatNumber.match(/^[A-Z]+/)?.[0] || "";
    };

    const match = String(seatNumber).match(
      /\d+$/
    );

    return match ? Number(match[0]) : 0;
  };

  // ==========================================
  // CALCULATE CURRENT CONFIGURATION
  // ==========================================

  const calculateCurrentConfiguration = (
    loadedSeats
  ) => {
    if (!loadedSeats || loadedSeats.length === 0) {
      setCurrentRows(0);
      setCurrentSeatsPerRow(0);
      return;
    }

    const rowMap = {};

    loadedSeats.forEach((seat) => {
      const seatNumber = getSeatNumber(seat);
      const rowLabel = getRowLabel(seatNumber);

      if (!rowLabel) {
        return;
      }

      if (!rowMap[rowLabel]) {
        rowMap[rowLabel] = 0;
      }

      rowMap[rowLabel]++;
    });

    const rowLabels = Object.keys(rowMap);

    // Number of rows
    setCurrentRows(rowLabels.length);

    // Maximum seats in one row
    const maxSeatsPerRow =
      rowLabels.length > 0
        ? Math.max(
            ...rowLabels.map(
              (rowLabel) => rowMap[rowLabel]
            )
          )
        : 0;

    setCurrentSeatsPerRow(
      maxSeatsPerRow
    );
  };

  // ==========================================
  // LOAD SEATS
  // ==========================================

  const fetchSeats = async (eventId) => {
    if (!eventId) {
      setSeats([]);
      setCurrentRows(0);
      setCurrentSeatsPerRow(0);
      return;
    }

    try {
      setLoadingSeats(true);
      setError("");

      const response = await api.get(
        `/events/${eventId}/seats`
      );

      const loadedSeats =
        response.data || [];

      /*
       * Sort seats properly:
       *
       * A1
       * A2
       * A3
       * ...
       * B1
       * B2
       * ...
       * Z10
       * AA1
       * AA2
       */

      const sortedSeats = [
        ...loadedSeats,
      ].sort((a, b) => {
        const seatA = getSeatNumber(a);
        const seatB = getSeatNumber(b);

        const rowA = getRowLabel(seatA);
        const rowB = getRowLabel(seatB);

        const rowIndexA =
          getRowIndex(rowA);

        const rowIndexB =
          getRowIndex(rowB);

        if (rowIndexA !== rowIndexB) {
          return rowIndexA - rowIndexB;
        }

        return (
          getSeatNumberValue(seatA) -
          getSeatNumberValue(seatB)
        );
      });

      setSeats(sortedSeats);

      calculateCurrentConfiguration(
        sortedSeats
      );
    } catch (err) {
      console.error(
        "Failed to load seats:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load seats."
      );
    } finally {
      setLoadingSeats(false);
    }
  };

  // ==========================================
  // EVENT CHANGE
  // ==========================================

  const handleEventChange = (e) => {
    const eventId = e.target.value;

    setSelectedEvent(eventId);

    setSuccess("");
    setError("");

    setRows("");
    setSeatsPerRow("");

    setSeats([]);

    setCurrentRows(0);
    setCurrentSeatsPerRow(0);

    if (eventId) {
      fetchSeats(eventId);
    }
  };

  // ==========================================
  // GENERATE / UPDATE SEATS
  // ==========================================

  const handleGenerateSeats = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedEvent) {
      setError(
        "Please select an event."
      );
      return;
    }

    const newRows = Number(rows);
    const newSeatsPerRow =
      Number(seatsPerRow);

    if (
      !rows ||
      !seatsPerRow ||
      !Number.isInteger(newRows) ||
      !Number.isInteger(newSeatsPerRow) ||
      newRows < 1 ||
      newSeatsPerRow < 1
    ) {
      setError(
        "Rows and seats per row must be whole numbers greater than 0."
      );
      return;
    }

    try {
      setGenerating(true);

      await api.post(
        `/events/${selectedEvent}/seats`,
        null,
        {
          params: {
            rows: newRows,
            seatsPerRow:
              newSeatsPerRow,
          },
        }
      );

      /*
       * Reload seats after generation.
       * This also updates currentRows
       * and currentSeatsPerRow.
       */

      await fetchSeats(selectedEvent);

      setRows("");
      setSeatsPerRow("");

      setSuccess(
        `Seat configuration updated successfully to ${newRows} rows × ${newSeatsPerRow} seats per row.`
      );
    } catch (err) {
      console.error(
        "Failed to generate seats:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to update seats.";

      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  // ==========================================
  // CHECK RESERVED
  // ==========================================

  const isReserved = (seat) => {
    return (
      seat.reserved === true ||
      seat.isReserved === true ||
      seat.status === "RESERVED" ||
      seat.status === "BOOKED"
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="manage-seats-main">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="manage-seats-header">

        <div>
          <p className="admin-label">
            ADMINISTRATION
          </p>

          <h1>Manage Seats</h1>

          <p>
            Generate and monitor seats
            for events.
          </p>
        </div>

        <Link
          to="/admin"
          className="back-admin-button"
        >
          ← Admin Dashboard
        </Link>

      </div>

      {/* ========================================
          ERROR
      ======================================== */}

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

      {/* ========================================
          SUCCESS
      ======================================== */}

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

      {/* ========================================
          SELECT EVENT
      ======================================== */}

      <section className="seat-management-card">

        <div className="seat-management-header">

          <div>
            <h2>Select Event</h2>

            <p>
              Choose an event to manage
              its seats.
            </p>
          </div>

        </div>

        {loadingEvents ? (
          <p>Loading events...</p>
        ) : (
          <select
            value={selectedEvent}
            onChange={handleEventChange}
            className="event-select"
          >

            <option value="">
              -- Select an Event --
            </option>

            {events.map((event) => (
              <option
                key={event.id}
                value={event.id}
              >
                {event.name ||
                  `Event #${event.id}`}
              </option>
            ))}

          </select>
        )}

      </section>

      {/* ========================================
          CURRENT CONFIGURATION
      ======================================== */}

      {selectedEvent && (
        <section className="seat-management-card">

          <div className="seat-management-header">

            <div>
              <h2>
                Current Seat Configuration
              </h2>

              <p>
                Existing seats for this
                event.
              </p>
            </div>

          </div>

         <div className="current-seat-configuration">

          <div>
            <span>
              Rows
            </span>

            <strong>
              {currentRows}
            </strong>
          </div>

          <div>
            <span>
              Seats Per Row
            </span>

            <strong>
              {currentSeatsPerRow}
            </strong>
          </div>

          <div>
            <span>
              Total Seats
            </span>

            <strong>
              {seats.length}
            </strong>
          </div>

        </div>

        </section>
      )}

      {/* ========================================
          GENERATE / UPDATE SEATS
      ======================================== */}

      {selectedEvent && (
        <section className="seat-management-card">

          <div className="seat-management-header">

            <div>
              <h2>
                Generate / Update Seats
              </h2>

              <p>
                Change the number of rows
                and seats per row.
              </p>
            </div>

          </div>

          <form
            className="generate-seats-form"
            onSubmit={handleGenerateSeats}
          >

            {/* ROWS */}

            <div className="form-group">

              <label htmlFor="rows">
                Rows
              </label>

              <input
                id="rows"
                type="number"
                min="1"
                step="1"
                value={rows}
                onChange={(e) =>
                  setRows(e.target.value)
                }
                placeholder={
                  currentRows > 0
                    ? String(currentRows)
                    : "e.g. 5"
                }
                required
              />

              {currentRows > 0 && (
                <small>
                  Current:{" "}
                  {currentRows} rows
                </small>
              )}

            </div>

            {/* SEATS PER ROW */}

            <div className="form-group">

              <label htmlFor="seatsPerRow">
                Seats Per Row
              </label>

              <input
                id="seatsPerRow"
                type="number"
                min="1"
                step="1"
                value={seatsPerRow}
                onChange={(e) =>
                  setSeatsPerRow(
                    e.target.value
                  )
                }
                placeholder={
                  currentSeatsPerRow > 0
                    ? String(
                        currentSeatsPerRow
                      )
                    : "e.g. 10"
                }
                required
              />

              {currentSeatsPerRow > 0 && (
                <small>
                  Current:{" "}
                  {currentSeatsPerRow}{" "}
                  seats per row
                </small>
              )}

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="generate-seats-button"
              disabled={generating}
            >
              {generating
                ? "Updating..."
                : "Generate / Update Seats"}
            </button>

          </form>

        </section>
      )}

      {/* ========================================
          SEAT GRID
      ======================================== */}

      {selectedEvent && (
        <section className="seats-management-section">

          <div className="seats-management-title">

            <div>
              <p className="admin-label">
                SEAT MANAGEMENT
              </p>

              <h2>
                Event Seats
              </h2>
            </div>

            <div className="seat-count">
              {seats.length} seats
            </div>

          </div>

          {loadingSeats ? (

            <div className="admin-loading">

              <div className="admin-spinner"></div>

              <p>
                Loading seats...
              </p>

            </div>

          ) : seats.length === 0 ? (

            <div className="admin-empty">

              <h3>
                No seats found
              </h3>

              <p>
                Generate seats for this
                event using the form above.
              </p>

            </div>

          ) : (

            <div className="admin-seats-layout">

            {Array.from(
              new Set(
                seats.map((seat) =>
                  getRowLabel(getSeatNumber(seat))
                )
              )
            ).map((rowLabel) => {

              const rowSeats = seats
                .filter(
                  (seat) =>
                    getRowLabel(
                      getSeatNumber(seat)
                    ) === rowLabel
                )
                .sort((a, b) => {

                  const aNumber = parseInt(
                    getSeatNumber(a).replace(
                      rowLabel,
                      ""
                    )
                  );

                  const bNumber = parseInt(
                    getSeatNumber(b).replace(
                      rowLabel,
                      ""
                    )
                  );

                  return aNumber - bNumber;
                });

              return (
                <div
                  key={rowLabel}
                  className="admin-seat-row"
                >

                  {/* ROW LABEL */}
                  <div className="admin-row-label">
                    {rowLabel}
                  </div>

                  {/* SEATS */}
                  <div className="admin-row-seats">

                    {rowSeats.map((seat) => {

                      const reserved =
                        isReserved(seat);

                      return (
                        <div
                          key={seat.id}
                          className={`admin-seat ${
                            reserved
                              ? "admin-seat-reserved"
                              : "admin-seat-available"
                          }`}
                        >

                          <strong>
                            {getSeatNumber(seat)}
                          </strong>

                          <span>
                            {reserved
                              ? "Reserved"
                              : "Available"}
                          </span>

                        </div>
                      );

                    })}

                  </div>

                </div>
              );

            })}

          </div>

          )}

        </section>
      )}

    </main>
  );
}

export default ManageSeats;