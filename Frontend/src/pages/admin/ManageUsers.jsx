import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import ConfirmDialog from "../../components/ConfirmDialog";
import "../../styles/ConfirmDialog.css";
import "../../styles/ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // GET ALL USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ROLE CLASS
  // ==========================================

  const getRoleClass = (role) => {
    return role?.toUpperCase() === "ADMIN"
      ? "user-role-admin"
      : "user-role-user";
  };

  // ==========================================
  // CHANGE USER ROLE
  // ==========================================

  const handleRoleChange = async (user) => {
    const currentRole =
      user.role?.toUpperCase() === "ADMIN"
        ? "ADMIN"
        : "USER";

    const newRole =
      currentRole === "ADMIN"
        ? "USER"
        : "ADMIN";

    setConfirmAction({
      type: "role",
      user,
      newRole,
    });
  };

  const applyRoleChange = async () => {
    const user = confirmAction.user;
    const newRole = confirmAction.newRole;

    try {
      setActionLoading(user.id);
      setError("");
      setSuccess("");

      await api.put(
        `/admin/users/${user.id}/role`,
        null,
        {
          params: {
            role: newRole,
          },
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                role: newRole,
              }
            : currentUser
        )
      );

      setSuccess(
        `${user.name}'s role changed to ${newRole}.`
      );
    } catch (err) {
      console.error(
        "Failed to change user role:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to change user role."
      );
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = (user) => {
    setConfirmAction({
      type: "delete",
      user,
    });
  };

  const applyDeleteUser = async () => {
    const user = confirmAction.user;

    try {
      setActionLoading(user.id);
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/users/${user.id}`
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            currentUser.id !== user.id
        )
      );

      setSuccess(
        `${user.name}'s account deleted successfully.`
      );
    } catch (err) {
      console.error(
        "Failed to delete user:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const handleConfirm = () => {
    if (confirmAction?.type === "role") {
      applyRoleChange();
    } else if (confirmAction?.type === "delete") {
      applyDeleteUser();
    }
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const adminCount = users.filter(
    (user) =>
      user.role?.toUpperCase() === "ADMIN"
  ).length;

  const regularUserCount =
    users.length - adminCount;

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="manage-users-main">

      {/* ================= HEADER ================= */}

      <div className="manage-users-header">

        <div>
          <p className="admin-label">
            ADMINISTRATION
          </p>

          <h1>Manage Users</h1>

          <p>
            View registered users and manage
            account roles.
          </p>
        </div>

        <Link
          to="/admin"
          className="back-admin-button"
        >
          ← Admin Dashboard
        </Link>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div className="admin-alert">

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


      {/* ================= SUCCESS ================= */}

      {success && (
        <div className="admin-success">

          <span>✓</span>

          <p>{success}</p>

          <button
            type="button"
            onClick={() => setSuccess("")}
          >
            ×
          </button>

        </div>
      )}


      {/* ================= USER SUMMARY ================= */}

      {!loading && !error && (
        <div className="users-summary-card">

          <div className="users-summary-item">
            <span>Total Users</span>

            <strong>
              {users.length}
            </strong>
          </div>


          <div className="users-summary-item">
            <span>Administrators</span>

            <strong>
              {adminCount}
            </strong>
          </div>


          <div className="users-summary-item">
            <span>Regular Users</span>

            <strong>
              {regularUserCount}
            </strong>
          </div>

        </div>
      )}


      {/* ================= USERS SECTION ================= */}

      <section className="users-management-section">

        <div className="users-section-header">

          <div>

            <p className="admin-label">
              USER MANAGEMENT
            </p>

            <h2>
              Registered Users
            </h2>

          </div>

          <div className="user-count">
            {users.length} users
          </div>

        </div>


        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="admin-loading">

            <div className="admin-spinner"></div>

            <p>
              Loading users...
            </p>

          </div>

        ) : users.length === 0 ? (

          /* ================= EMPTY ================= */

          <div className="admin-empty">

            <h3>
              No users found
            </h3>

            <p>
              There are currently no registered
              users.
            </p>

          </div>

        ) : (

          /* ================= USERS LIST ================= */

          <div className="users-list">

            {users.map((user) => {

              const isActionLoading =
                actionLoading === user.id;

              const isAdmin =
                user.role?.toUpperCase() ===
                "ADMIN";

              return (

                <article
                  className="user-card"
                  key={user.id}
                >

                  {/* ================= AVATAR ================= */}

                  <div className="user-avatar">
                    {(user.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>


                  {/* ================= USER INFO ================= */}

                  <div className="user-info">

                    <p>
                      USER #{user.id}
                    </p>

                    <h3>
                      {user.name ||
                        "Unnamed User"}
                    </h3>

                    <span>
                      {user.email ||
                        "No email"}
                    </span>

                  </div>


                  {/* ================= ROLE ================= */}

                  <div className="user-role-wrapper">

                    <span
                      className={`user-role ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {user.role || "USER"}
                    </span>

                  </div>


                  {/* ================= ACTIONS ================= */}

                  <div className="user-actions">

                    <button
                      type="button"
                      className="change-role-button"
                      disabled={isActionLoading}
                      onClick={() =>
                        handleRoleChange(user)
                      }
                    >
                      {isActionLoading
                        ? "Updating..."
                        : isAdmin
                        ? "Make User"
                        : "Make Admin"}
                    </button>


                    <button
                      type="button"
                      className="delete-user-button"
                      disabled={isActionLoading}
                      onClick={() =>
                        handleDeleteUser(user)
                      }
                    >
                      {isActionLoading
                        ? "Processing..."
                        : "Delete"}
                    </button>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </section>

      <ConfirmDialog
        open={!!confirmAction}
        title={
          confirmAction?.type === "delete"
            ? "Delete User"
            : "Change User Role"
        }
        message={
          confirmAction?.type === "delete"
            ? `Are you sure you want to delete ${confirmAction.user?.name}'s account? This action cannot be undone.`
            : `Are you sure you want to change ${confirmAction?.user?.name}'s role to ${confirmAction?.newRole}?`
        }
        confirmLabel={
          confirmAction?.type === "delete"
            ? "Delete User"
            : "Change Role"
        }
        loading={actionLoading != null}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

    </main>
  );
}

export default ManageUsers;