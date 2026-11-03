
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/syncreserve_logo.png";
import api from "../api/axios";
import "../styles/Landing.css";

function Landing() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents((response.data || []).slice(0, 3));
      } catch (error) {
        console.error("Failed to load featured events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="landing-navbar">
        <Link to="/" className="landing-logo">
          <div className="navbar-brand">
                  <img
                    src={logo}
                    alt="SyncReserve logo"
                    className="navbar-logo"
                  />
                  <span className="navbar-brand-name">
                    <span>Sync</span>Reserve
                  </span>
         </div>
        </Link>

        <div className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <div className="landing-nav-actions">
          <Link to="/login" className="landing-login">
            Sign In
          </Link>
          <Link to="/register" className="landing-get-started">
            Get Started <span>→</span>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero" id="home">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-dot"></span>
            SMART EVENT RESERVATION PLATFORM
          </div>

          <h1>
            Your Next Experience,
            <br />
            <span>One Seat Away.</span>
          </h1>

          <p>
            Discover exciting events, choose your favourite seats
            and reserve them effortlessly. Your next unforgettable
            experience starts here.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="hero-primary-button">
              Get Started <span>→</span>
            </Link>

          </div>

          <div className="hero-trust">
            <span>✓</span>
            Simple booking. Secure reservations. Real-time availability.
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-glow"></div>

          <div className="hero-ticket">
            <div className="ticket-top">
              <span>YOUR NEXT EVENT</span>
              <span className="ticket-status">AVAILABLE</span>
            </div>

            <div className="ticket-icon">✦</div>

            <h3>Make Every Moment Count.</h3>
            <p>Your experience begins with a reservation.</p>

            <div className="ticket-divider"></div>

            <div className="ticket-bottom">
              <div>
                <small>BOOK YOUR SEAT</small>
                <strong>ANYTIME, ANYWHERE</strong>
              </div>
              <div className="ticket-arrow">↗</div>
            </div>
          </div>

          <div className="floating-card floating-card-one">
            <span>✓</span>
            Secure Booking
          </div>

          <div className="floating-card floating-card-two">
            <span>◈</span>
            Real-time Seats
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features" id="features">
        <div className="landing-section-heading">
          <span>WHY SYNCRESERVE?</span>
          <h2>Reservations made simple.</h2>
          <p>
            Everything you need for a smooth and reliable
            event booking experience.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">◈</div>
            <h3>Easy Event Discovery</h3>
            <p>
              Explore upcoming events and find experiences
              that match your interests.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">▦</div>
            <h3>Real-time Seat Selection</h3>
            <p>
              View seat availability and select your preferred
              seat before completing your reservation.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Secure Reservations</h3>
            <p>
              Reliable reservation processing helps prevent
              multiple users from booking the same seat.
            </p>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-how" id="how-it-works">
        <div className="landing-section-heading">
          <span>HOW IT WORKS</span>
          <h2>Three steps. One great experience.</h2>
          <p>Booking your next event has never been easier.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <div className="step-icon">⌕</div>
            <h3>Discover Events</h3>
            <p>Browse events and find something exciting.</p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <div className="step-icon">▦</div>
            <h3>Select Your Seat</h3>
            <p>Choose an available seat that suits you.</p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <div className="step-icon">✓</div>
            <h3>Confirm Reservation</h3>
            <p>Complete your booking and get ready to enjoy.</p>
          </div>
        </div>
      </section>

     
      {/* CTA */}
      <section className="landing-cta">
        <span>YOUR NEXT EXPERIENCE STARTS HERE</span>
        <h2>
          Ready to reserve
          <br />
          your next experience?
        </h2>
        <p>
          Join SyncReserve and make your next event reservation
          simple and effortless.
        </p>
        <Link to="/register" className="cta-button">
          Get Started Now →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <Link to="/" className="landing-logo">
          <span className="logo-symbol">◆</span>
          SyncReserve
        </Link>

        <p>
          Making event reservations simpler, smarter and more reliable.
        </p>

        <div className="footer-links">
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} SyncReserve. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default Landing;
