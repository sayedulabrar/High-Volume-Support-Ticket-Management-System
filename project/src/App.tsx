import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Lazy-loaded components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));

// Customer routes
const CustomerTickets = lazy(() => import("./pages/customer/Tickets"));
const CreateTicket = lazy(() => import("./pages/customer/CreateTicket"));
const CustomerTicketDetails = lazy(
  () => import("./pages/customer/TicketDetails")
);

// Support Agent routes
const AgentTickets = lazy(() => import("./pages/agent/Tickets"));
const AgentTicketDetails = lazy(() => import("./pages/agent/TicketDetails"));

// Admin routes
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const EditUser = lazy(() => import("./pages/admin/EditUser"));
const TicketManagement = lazy(() => import("./pages/admin/TicketManagement"));

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Dashboard />
              </Suspense>
            }
          />

          <Route
            path="/profile"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Profile />
              </Suspense>
            }
          />

          {/* Customer routes */}
          <Route element={<RoleRoute role="Customer" />}>
            <Route
              path="/tickets"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CustomerTickets />
                </Suspense>
              }
            />
            <Route
              path="/tickets/create"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CreateTicket />
                </Suspense>
              }
            />
            <Route
              path="/tickets/:id"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CustomerTicketDetails />
                </Suspense>
              }
            />
          </Route>

          {/* Support Agent routes */}
          <Route element={<RoleRoute role="Support Agent" />}>
            <Route
              path="/support/tickets"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AgentTickets />
                </Suspense>
              }
            />
            <Route
              path="/support/tickets/:id"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AgentTicketDetails />
                </Suspense>
              }
            />
          </Route>

          {/* Admin routes */}
          <Route element={<RoleRoute role="Admin" />}>
            <Route
              path="/admin/dashboard"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <UserManagement />
                </Suspense>
              }
            />
            <Route
              path="/admin/users/:id/edit"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <EditUser />
                </Suspense>
              }
            />
            <Route
              path="admin/ticketManagement"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TicketManagement />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
