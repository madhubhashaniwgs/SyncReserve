import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [token, setToken] = useState(
    sessionStorage.getItem("resetToken") || ""
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token.trim()) {
      setError("Reset token is required.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          token: token.trim(),
          newPassword: newPassword,
        }
      );

      setSuccess(
        response.data?.message ||
          "Password reset successfully."
      );

      sessionStorage.removeItem("resetToken");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "Reset password failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-page">

      <div className="reset-password-card">

        <div className="reset-password-header">

          <h1>SyncReserve</h1>

          <p>
            Create a new password
          </p>

        </div>

        {error && (
          <div className="reset-password-error">
            {error}
          </div>
        )}

        {success && (
          <div className="reset-password-success">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="reset-password-form"
        >

          {!sessionStorage.getItem("resetToken") && (
            <div className="form-group">

              <label htmlFor="token">
                Reset Token
              </label>

              <input
                id="token"
                type="text"
                placeholder="Enter your reset token"
                value={token}
                onChange={(e) =>
                  setToken(e.target.value)
                }
                disabled={isLoading}
                required
              />

            </div>
          )}

          <div className="form-group">

            <label htmlFor="newPassword">
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              disabled={isLoading}
              required
              minLength={6}
            />

          </div>

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              disabled={isLoading}
              required
              minLength={6}
            />

          </div>

          <button
            type="submit"
            className="reset-password-button"
            disabled={isLoading}
          >
            {isLoading
              ? "Resetting password..."
              : "Reset Password"}
          </button>

        </form>

        <div className="reset-password-footer">

          <Link to="/login">
            ← Back to Sign In
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;