import { useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  const [showRemoveModal, setShowRemoveModal] =
    useState(false);

  const [profileMessage, setProfileMessage] = useState({
    type: "",
    text: "",
  });

  const name = user.name || "User";
  const email = user.email || "No email available";
  const role = user.role || "USER";

  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();


  // =====================================================
  // CHANGE PROFILE PHOTO
  // =====================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileMessage({
        type: "error",
        text: "Please select a valid image file.",
      });

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      setProfileImage(imageData);

      localStorage.setItem(
        "profileImage",
        imageData
      );

      window.dispatchEvent(
        new Event("profileImageUpdated")
      );

      setProfileMessage({
        type: "success",
        text: "Profile photo updated successfully.",
      });
    };

    reader.readAsDataURL(file);

    // Same image eka again select karanna puluwan
    event.target.value = "";
  };


  // =====================================================
  // OPEN REMOVE CONFIRMATION
  // =====================================================

  const openRemoveConfirmation = () => {
    setShowRemoveModal(true);
  };


  // =====================================================
  // CLOSE REMOVE CONFIRMATION
  // =====================================================

  const closeRemoveConfirmation = () => {
    setShowRemoveModal(false);
  };


  // =====================================================
  // CONFIRM REMOVE PHOTO
  // =====================================================

  const handleConfirmRemove = () => {
    setProfileImage("");

    localStorage.removeItem("profileImage");

    window.dispatchEvent(
      new Event("profileImageUpdated")
    );

    setShowRemoveModal(false);

    setProfileMessage({
      type: "success",
      text: "Profile photo removed successfully.",
    });
  };


  // =====================================================
  // CLOSE PAGE ALERT
  // =====================================================

  const closeProfileMessage = () => {
    setProfileMessage({
      type: "",
      text: "",
    });
  };


  return (
    <main className="profile-page">

      <div className="profile-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="profile-header">

          <div>

            <p className="profile-label">
              ACCOUNT
            </p>

            <h1>My Profile</h1>

            <p>
              Manage your SyncReserve account and security.
            </p>

          </div>


          <Link
            to="/dashboard"
            className="profile-back-button"
          >
            ← Dashboard
          </Link>

        </div>


        {/* =================================================
            PROFILE ALERT
        ================================================= */}

        {profileMessage.text && (

          <div
            className={`profile-page-alert ${profileMessage.type}`}
          >

            <span>
              {profileMessage.type === "success"
                ? "✓"
                : "!"}
            </span>

            <p>
              {profileMessage.text}
            </p>

            <button
              type="button"
              onClick={closeProfileMessage}
            >
              ×
            </button>

          </div>

        )}


        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <section className="profile-card">

          <div className="profile-card-header">

            {/* PROFILE IMAGE */}

            <div className="profile-image-section">

              <div className="profile-avatar">

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt="Profile"
                    className="profile-image"
                  />

                ) : (

                  initials

                )}

              </div>


              {/* PHOTO ACTIONS */}

              <div className="profile-image-actions">

                <label
                  htmlFor="profile-image-input"
                  className="upload-profile-button"
                >
                  Edit Photo
                </label>

                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />


                {profileImage && (

                  <button
                    type="button"
                    className="remove-profile-button"
                    onClick={openRemoveConfirmation}
                  >
                    Remove
                  </button>

                )}

              </div>

            </div>


            {/* USER INFO */}

            <div className="profile-main-info">

              <p className="profile-small-label">
                YOUR PROFILE
              </p>

              <h2>{name}</h2>

              <p>{email}</p>

            </div>

          </div>


          <div className="profile-divider"></div>


          {/* =================================================
              PROFILE DETAILS
          ================================================= */}

          <div className="profile-details">

            <div className="profile-detail-item">

              <span>
                Full Name
              </span>

              <strong>
                {name}
              </strong>

            </div>


            <div className="profile-detail-item">

              <span>
                Email Address
              </span>

              <strong>
                {email}
              </strong>

            </div>


            <div className="profile-detail-item">

              <span>
                Account Type
              </span>

              <strong className="profile-role">
                {role}
              </strong>

            </div>


            <div className="profile-detail-item">

              <span>
                Account Status
              </span>

              <strong className="profile-status">
                Active
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            SECURITY CARD
        ================================================= */}

        <section className="profile-security-card">

          <div className="security-icon">
            🔐
          </div>


          <div className="security-info">

            <p className="profile-small-label">
              SECURITY
            </p>

            <h2>
              Password & Security
            </h2>

            <p>
              Keep your account secure by regularly
              updating your password.
            </p>

          </div>


          <Link
            to="/change-password"
            className="change-password-button"
          >
            Change Password →
          </Link>

        </section>

      </div>


      {/* =====================================================
          REMOVE PROFILE PHOTO CONFIRMATION MODAL
      ===================================================== */}

      {showRemoveModal && (

        <div
          className="profile-modal-overlay"
          onClick={closeRemoveConfirmation}
        >

          <div
            className="profile-remove-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="profile-remove-modal-icon">
              !
            </div>


            <h2>
              Remove Profile Photo?
            </h2>


            <p>
              Are you sure you want to remove
              your current profile picture?
            </p>


            <p className="profile-remove-warning">
              Your profile will show your initials instead.
            </p>


            <div className="profile-modal-actions">

              <button
                type="button"
                className="profile-modal-back-button"
                onClick={closeRemoveConfirmation}
              >
                Keep Photo
              </button>


              <button
                type="button"
                className="profile-modal-confirm-button"
                onClick={handleConfirmRemove}
              >
                Yes, Remove
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Profile;