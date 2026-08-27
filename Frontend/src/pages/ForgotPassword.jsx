import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setResetToken("");

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        { email }
      );

      setSuccess(
        response.data?.message ||
          "Password reset token generated."
      );

      setResetToken(
        response.data?.resetToken || ""
      );
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

          <div className="forgot-password-icon">
            🔐
          </div>

          <p className="auth-label">
            ACCOUNT RECOVERY
          </p>

          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email address
            to generate a password reset token.
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
              required
            />

          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : "Generate Reset Token"}
          </button>

        </form>

        {resetToken && (
          <div className="reset-token-box">

            <div>
              <span>RESET TOKEN</span>

              <p>
                Copy this token and use it on
                the reset password page.
              </p>
            </div>

            <code>
              {resetToken}
            </code>

            <Link
              to={`/reset-password?token=${encodeURIComponent(
                resetToken
              )}`}
              className="continue-reset-button"
            >
              Continue to Reset Password →
            </Link>

          </div>
        )}

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