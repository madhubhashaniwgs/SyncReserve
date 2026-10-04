import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/syncreserve_logo.png";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        { email: email.trim().toLowerCase() }
      );

      setSuccess(
        response.data?.message ||
          "A verification code has been sent to your email address."
      );

      navigate(`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err) {
      console.error(
        "Forgot password failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to process password reset request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">

      <section className="forgot-password-card">

        <div className="forgot-password-header">

          <img
            src={logo}
            alt="SyncReserve logo"
            className="auth-logo"
          />

          <div className="forgot-password-icon">
            🔐
          </div>

          <p className="auth-label">
            ACCOUNT RECOVERY
          </p>

          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email address
            to receive a verification code.
          </p>

        </div>

        {error && (
          <div className="auth-alert auth-alert-error">
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

        {success && (
          <div className="auth-alert auth-alert-success">
            <span>✓</span>
            <p>{success}</p>
          </div>
        )}

        <form
          className="forgot-password-form"
          onSubmit={handleSubmit}
        >

          <div className="auth-form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              maxLength={150}
              required
            />

          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Verification Code"}
          </button>

        </form>

        <div className="auth-footer">

          <Link to="/login">
            ← Back to Login
          </Link>

        </div>

      </section>

    </main>
  );
}

export default ForgotPassword;