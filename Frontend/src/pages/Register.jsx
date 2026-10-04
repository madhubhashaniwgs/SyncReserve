import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/syncreserve_logo.png";
import "../styles/Register.css";
import {
  getPasswordValidationError,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../utils/validation";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error("Registration failed:", error);
      console.error("Backend response:", error.response?.data);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data) {
        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : "Registration failed."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* Header */}
        <div className="register-header">
          <img
            src={logo}
            alt="SyncReserve logo"
            className="auth-logo"
          />
          <div className="register-logo">
            <span>Sync</span>Reserve
          </div>

          <p className="register-eyebrow">
            CREATE YOUR ACCOUNT
          </p>

          <h1>Get started today</h1>

          <p className="register-subtitle">
            Create your account and start reserving your seats.
          </p>
        </div>


        {/* Error */}
        {error && (
          <div className="register-message register-error">
            {error}
          </div>
        )}


        {/* Success */}
        {success && (
          <div className="register-message register-success">
            {success}
          </div>
        )}


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="register-form"
        >

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              maxLength={100}
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              maxLength={150}
              required
            />

          </div>


          <div className="form-row">

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                disabled={isLoading}
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                required
              />

            </div>

          </div>


          <div className="password-hint">
            Use 8–100 characters with uppercase, lowercase, and a number.
          </div>


          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>


        {/* Login */}
        <div className="login-link">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;