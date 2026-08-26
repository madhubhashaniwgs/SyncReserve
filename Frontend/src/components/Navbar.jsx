import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <aside className="navbar-sidebar">

      {/* Brand */}
      <div className="navbar-brand">
        <span>Sync</span>Reserve
      </div>

      {/* Main Navigation */}
      <nav className="navbar-nav">

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

      </nav>

      {/* Bottom Navigation */}
      <div className="navbar-bottom">

        <div className="navbar-user">

          <div className="navbar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
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

        <Link
          to="/profile"
          className={`navbar-link ${isActive("/profile")}`}
        >
          <span className="navbar-icon">○</span>
          <span>Profile</span>
        </Link>

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