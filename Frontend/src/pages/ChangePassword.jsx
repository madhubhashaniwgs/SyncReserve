import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./ChangePassword.css";

function ChangePassword() {

  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all password fields."
      );

      return;
    }


    if (newPassword.length < 6) {

      setError(
        "New password must be at least 6 characters."
      );

      return;
    }


    if (newPassword !== confirmPassword) {

      setError(
        "New password and confirmation password do not match."
      );

      return;
    }


    if (currentPassword === newPassword) {

      setError(
        "New password must be different from your current password."
      );

      return;
    }


    try {

      setLoading(true);


      await api.post(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );


      setSuccess(
        "Password changed successfully."
      );


      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");


      setTimeout(() => {
        navigate("/profile");
      }, 1500);


    } catch (err) {

      console.error(
        "Failed to change password:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Unable to change password."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <main className="change-password-page">

      <div className="change-password-container">

        {/* HEADER */}

        <div className="change-password-header">

          <div>

            <p className="profile-label">
              SECURITY
            </p>

            <h1>Change Password</h1>

            <p>
              Update your SyncReserve account password.
            </p>

          </div>


          <Link
            to="/profile"
            className="password-back-button"
          >
            ← My Profile
          </Link>

        </div>


        {/* ALERT */}

        {error && (

          <div className="password-alert password-alert-error">

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

          <div className="password-alert password-alert-success">

            <span>✓</span>

            <p>{success}</p>

          </div>

        )}


        {/* FORM */}

        <section className="change-password-card">

          <div className="password-card-heading">

            <div className="password-lock-icon">
              🔐
            </div>

            <div>

              <h2>
                Update Your Password
              </h2>

              <p>
                Enter your current password and
                choose a new secure password.
              </p>

            </div>

          </div>


          <form
            className="change-password-form"
            onSubmit={handleSubmit}
          >

            {/* CURRENT */}

            <div className="password-form-group">

              <label htmlFor="currentPassword">
                Current Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="currentPassword"
                  type={
                    showCurrent
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrent(
                      !showCurrent
                    )
                  }
                >
                  {showCurrent ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* NEW */}

            <div className="password-form-group">

              <label htmlFor="newPassword">
                New Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="newPassword"
                  type={
                    showNew
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNew(!showNew)
                  }
                >
                  {showNew ? "Hide" : "Show"}
                </button>

              </div>

              <small>
                Password must contain at least 6 characters.
              </small>

            </div>


            {/* CONFIRM */}

            <div className="password-form-group">

              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="confirmPassword"
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(
                      !showConfirm
                    )
                  }
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="password-form-actions">

              <Link
                to="/profile"
                className="cancel-password-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="update-password-button"
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>

            </div>

          </form>

        </section>

      </div>

    </main>
  );
}

export default ChangePassword;