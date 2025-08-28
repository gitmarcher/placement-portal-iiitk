import React, { useEffect, useContext, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Toast from "./components/Toast";
import {
  StudentCredProvider,
  StudentCredContext
} from "./contexts/StudentCredContext";
import { StudentDetailsProvider } from "./contexts/StudentDetailsContext";
import { checkAuthStatus } from "./API/authentication";

// Lazy-loaded components
const LoginPage = lazy(() => import("../src/Pages/LoginPage"));
const StudentDashboard = lazy(() => import("./Pages/StudentDashboard"));
const Profile = lazy(() => import("../src/Pages/Profile"));
const StudentDrive = lazy(() => import("./Pages/StudentDrive"));
const AddDrive = lazy(() => import("./Pages/AddDrive"));
const EditDrive = lazy(() => import("./Pages/EditDrive"));
const CoordinatorDrive = lazy(() => import("./Pages/CoordinatorDrive"));
const CoordinatorDashboard = lazy(() => import("./Pages/CoordinatorDashboard"));
const CompleteProfile = lazy(() => import("./Pages/CompleteProfile"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Unauthorized = lazy(() => import("./components/Unauthorized"));

// Fallback component for Suspense
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-xl font-semibold">Loading...</div>
  </div>
);

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
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />{" "}
              {/* Keep for backward compatibility */}
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
                  <ProtectedRoute
                    requiredRole="student"
                    currentPath="/dashboard"
                  >
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
                  <ProtectedRoute
                    requiredRole="student"
                    currentPath="/drive/:id"
                  >
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
          </Suspense>
        </AuthChecker>
      </StudentCredProvider>
    </StudentDetailsProvider>
  );
};

export default App;
