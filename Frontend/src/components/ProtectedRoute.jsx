import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const {
    user,
    loading,
  } = useAuth();


  // =====================================================
  // AUTHENTICATION LOADING
  // =====================================================

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =====================================================
  // ROLE AUTHORIZATION
  // =====================================================

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {

    if (user.role === "ADMIN") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  // =====================================================
  // AUTHORIZED
  // =====================================================

  return children;
}

export default ProtectedRoute;