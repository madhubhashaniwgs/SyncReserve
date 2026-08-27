import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Reservations from "./pages/Reservations";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import EditEvent from "./pages/admin/EditEvent";
import CreateEvent from "./pages/admin/CreateEvent";
import ManageSeats from "./pages/admin/ManageSeats";
import AllReservations from "./pages/admin/AllReservations";
import ManageUsers from "./pages/admin/ManageUsers";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <Routes>

      {/* ============================= */}
      {/* PUBLIC ROUTES */}
      {/* ============================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* ============================= */}
      {/* USER ROUTES */}
      {/* ============================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute
            allowedRoles={["USER", "ADMIN"]}
          >
            <Events />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/:eventId"
        element={
          <ProtectedRoute
            allowedRoles={["USER", "ADMIN"]}
          >
            <EventDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reservations"
        element={
          <ProtectedRoute
            allowedRoles={["USER", "ADMIN"]}
          >
            <Reservations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute
            allowedRoles={["USER", "ADMIN"]}
          >
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute
            allowedRoles={["USER", "ADMIN"]}
          >
            <ChangePassword />
          </ProtectedRoute>
        }
      />


      {/* ============================= */}
      {/* ADMIN ROUTES */}
      {/* ============================= */}

            
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <ManageEvents />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/seats"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <ManageSeats />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/edit/:eventId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <EditEvent />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <CreateEvent />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AllReservations />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <ManageUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


      {/* ============================= */}
      {/* UNKNOWN ROUTE */}
      {/* ============================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;