import React, { useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../src/Pages/LoginPage";
import StudentDashboard from "./Pages/StudentDashboard";
import Profile from "../src/Pages/Profile";
import StudentDrive from "./Pages/StudentDrive";
import AddDrive from "./Pages/AddDrive";
import EditDrive from "./Pages/EditDrive";
import CoordinatorDrive from "./Pages/CoordinatorDrive";
import CoordinatorDashboard from "./Pages/CoordinatorDashboard";
import CompleteProfile from "./Pages/CompleteProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import Toast from "./components/Toast";
import {
  StudentCredProvider,
  StudentCredContext
} from "./contexts/StudentCredContext";
import { StudentDetailsProvider } from "./contexts/StudentDetailsContext";
import { checkAuthStatus } from "./API/authentication";

// Authentication checker component
const AuthChecker = ({ children }) => {
  const { setAuthenticatedUser, clearAuthentication, setLoading } =
    useContext(StudentCredContext);

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        setLoading(true);
        const authResult = await checkAuthStatus();

        if (authResult.isAuthenticated) {
          setAuthenticatedUser(authResult.userType);
        } else {
          clearAuthentication();
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        clearAuthentication();
      } finally {
        setLoading(false);
      }
    };

    verifyAuthentication();
  }, [setAuthenticatedUser, clearAuthentication, setLoading]);

  return children;
};

const App = () => {
  return (
    <StudentDetailsProvider>
      <StudentCredProvider>
        <AuthChecker>
          {/* Global Toast Container */}
          <Toast />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<h1>Home Page</h1>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Student protected routes */}
            <Route
              path="/complete-profile"
              element={
                <ProtectedRoute
                  requiredRole="student"
                  currentPath="/complete-profile"
                >
                  <CompleteProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="student" currentPath="/dashboard">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRole="student" currentPath="/profile">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drive/:id"
              element={
                <ProtectedRoute requiredRole="student" currentPath="/drive/:id">
                  <StudentDrive />
                </ProtectedRoute>
              }
            />

            {/* Coordinator protected routes */}
            <Route
              path="/coordinator/add-drive"
              element={
                <ProtectedRoute
                  requiredRole="coordinator"
                  currentPath="/coordinator/add-drive"
                >
                  <AddDrive />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/edit-drive/:id"
              element={
                <ProtectedRoute
                  requiredRole="coordinator"
                  currentPath="/coordinator/edit-drive/:id"
                >
                  <EditDrive />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/drive/:id"
              element={
                <ProtectedRoute
                  requiredRole="coordinator"
                  currentPath="/coordinator/drive/:id"
                >
                  <CoordinatorDrive />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/dashboard"
              element={
                <ProtectedRoute
                  requiredRole="coordinator"
                  currentPath="/coordinator/dashboard"
                >
                  <CoordinatorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all route for 404 */}
            <Route
              path="*"
              element={<Unauthorized attemptedAccess="Page not found" />}
            />
          </Routes>
        </AuthChecker>
      </StudentCredProvider>
    </StudentDetailsProvider>
  );
};

export default App;
