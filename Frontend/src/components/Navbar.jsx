import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  useEffect(() => {
    const handleProfileImageChange = () => {
      setProfileImage(
        localStorage.getItem("profileImage") || ""
      );
    };

    window.addEventListener(
      "profileImageUpdated",
      handleProfileImageChange
    );

    return () => {
      window.removeEventListener(
        "profileImageUpdated",
        handleProfileImageChange
      );
    };
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // ACTIVE NAVIGATION
  // =====================================================

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // For parent routes such as:
  // /admin/events
  // /admin/events/create
  // /admin/events/edit/1

  const isAdminSectionActive = (path) => {
    return location.pathname.startsWith(path) ? "active" : "";
  };

  // =====================================================
  // ROLE
  // =====================================================

  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="navbar-sidebar">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="navbar-brand">
        <span>Sync</span>Reserve
      </div>


      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <nav className="navbar-nav">

        {/* ===================================================
            COMMON NAVIGATION
            USER + ADMIN
        =================================================== */}

        <Link
          to="/dashboard"
          className={`navbar-link ${isActive("/dashboard")}`}
        >
          <span className="navbar-icon">⌂</span>
          <span>Dashboard</span>
        </Link>


        <Link
          to="/events"
          className={`navbar-link ${isActive("/events")}`}
        >
          <span className="navbar-icon">◈</span>
          <span>Events</span>
        </Link>


        <Link
          to="/reservations"
          className={`navbar-link ${isActive("/reservations")}`}
        >
          <span className="navbar-icon">▣</span>
          <span>My Reservations</span>
        </Link>


        {/* ===================================================
            ADMIN NAVIGATION
            ADMIN ONLY
        =================================================== */}

        {isAdmin && (
          <>

            <div className="navbar-section-title">
              ADMIN
            </div>


            {/* Admin Dashboard */}

            <Link
              to="/admin"
              className={`navbar-link ${isActive("/admin")}`}
            >
              <span className="navbar-icon">▤</span>
              <span>Admin Dashboard</span>
            </Link>


            {/* Manage Users */}

            <Link
              to="/admin/users"
              className={`navbar-link ${isAdminSectionActive(
                "/admin/users"
              )}`}
            >
              <span className="navbar-icon">♙</span>
              <span>Manage Users</span>
            </Link>


            {/* Manage Events */}

            <Link
              to="/admin/events"
              className={`navbar-link ${isAdminSectionActive(
                "/admin/events"
              )}`}
            >
              <span className="navbar-icon">◈</span>
              <span>Manage Events</span>
            </Link>


            {/* Manage Seats */}

            <Link
              to="/admin/seats"
              className={`navbar-link ${isAdminSectionActive(
                "/admin/seats"
              )}`}
            >
              <span className="navbar-icon">▦</span>
              <span>Manage Seats</span>
            </Link>


            {/* All Reservations */}

            <Link
              to="/admin/reservations"
              className={`navbar-link ${isAdminSectionActive(
                "/admin/reservations"
              )}`}
            >
              <span className="navbar-icon">✓</span>
              <span>All Reservations</span>
            </Link>

          </>
        )}

      </nav>


      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <div className="navbar-bottom">

        {/* ===================================================
            USER INFORMATION
        =================================================== */}

        <div className="navbar-user">

          <div className="navbar-avatar">

          {profileImage ? (

            <img
              src={profileImage}
              alt="Profile"
              className="navbar-profile-image"
            />

          ) : (

            user?.name?.charAt(0)?.toUpperCase() || "U"

          )}

        </div>

          <div className="navbar-user-info">

            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.role || "USER"}
            </span>

          </div>

        </div>


        {/* ===================================================
            PROFILE
            USER + ADMIN
        =================================================== */}

        <Link
          to="/profile"
          className={`navbar-link ${isActive("/profile")}`}
        >
          <span className="navbar-icon">○</span>
          <span>Profile</span>
        </Link>


        {/* ===================================================
            CHANGE PASSWORD
            USER + ADMIN
        =================================================== */}

        

        {/* ===================================================
            LOGOUT
            USER + ADMIN
        =================================================== */}

        <button
          type="button"
          className="navbar-link navbar-logout"
          onClick={handleLogout}
        >
          <span className="navbar-icon">↪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Navbar;