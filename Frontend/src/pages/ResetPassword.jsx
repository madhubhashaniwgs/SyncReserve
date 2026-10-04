import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/syncreserve_logo.png";
import "../styles/ResetPassword.css";
import {
  getPasswordValidationError,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../utils/validation";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (!/^\d{4,8}$/.test(code.trim())) {
      setError("Enter the 4–8 digit verification code from your email.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/auth/verify-reset-code", {
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });

      setResetToken(response.data.resetToken);
      setCodeVerified(true);
      setSuccess("Code verified. Create your new password.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid or expired verification code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!codeVerified || !resetToken) {
      setError("Verify the code before resetting your password.");
      return;
    }

    const passwordError = getPasswordValidationError(newPassword);
    if (passwordError) {
      setError(passwordError);
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
          token: resetToken,
          newPassword: newPassword,
        }
      );

      setSuccess(
        response.data?.message ||
          "Password reset successfully."
      );

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

          <img
            src={logo}
            alt="SyncReserve logo"
            className="auth-logo"
          />

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

        {!codeVerified ? (
          <form
            onSubmit={handleVerifyCode}
            className="reset-password-form"
          >
            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={isLoading}
                maxLength={150}
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="code">
                Verification Code
              </label>

              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter the code from your email"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 8))
                }
                disabled={isLoading}
                minLength={4}
                maxLength={8}
                required
              />

            </div>

            <button
              type="submit"
              className="reset-password-button"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="reset-password-form"
          >
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
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
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
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
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
        )}

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