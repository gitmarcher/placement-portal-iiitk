import React, { createContext, useState, useCallback } from "react";

const StudentCredContext = createContext();

const StudentCredProvider = ({ children }) => {
  // Only store minimal UI state - no sensitive credentials
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userType: null, // 'student' or 'coordinator'
    isLoading: true // For initial auth check
  });

  // Update authentication state (called after successful login)
  const setAuthenticatedUser = useCallback((userType) => {
    setAuthState({
      isAuthenticated: true,
      userType,
      isLoading: false
    });
  }, []);

  // Clear authentication state (called on logout)
  const clearAuthentication = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      userType: null,
      isLoading: false
    });
  }, []);

  // Set loading state
  const setLoading = useCallback((loading) => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: loading
    }));
  }, []);

  // Helper function to check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return authState.isAuthenticated;
  }, [authState.isAuthenticated]);

  // Helper function to get user role
  const getUserRole = useCallback(() => {
    return authState.userType;
  }, [authState.userType]);

  // Helper function to check if user has specific role
  const hasRole = useCallback(
    (requiredRole) => {
      return authState.userType === requiredRole;
    },
    [authState.userType]
  );

  // Create backward-compatible studentCreds object structure
  const studentCreds = authState.isAuthenticated
    ? {
        creds: {
          type: authState.userType,
          creds: "authenticated" // Legacy field expected by some components
        },
        type: authState.userType,
        username: "authenticated" // Legacy field expected by some components
      }
    : null;

  return (
    <StudentCredContext.Provider
      value={{
        // New secure state
        authState,

        // New secure actions
        setAuthenticatedUser,
        clearAuthentication,
        setLoading,

        // Helper functions
        isAuthenticated,
        getUserRole,
        hasRole,

        // Backward compatible structure (no sensitive data, just UI state)
        studentCreds,
        updateStudentCreds: setAuthenticatedUser,
        clearStudentCreds: clearAuthentication
      }}
    >
      {children}
    </StudentCredContext.Provider>
  );
};

export default StudentCredProvider;
export { StudentCredProvider, StudentCredContext };
