import React, { createContext, useState, useEffect } from "react";

const StudentCredContext = createContext();

const StudentCredProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [studentCreds, setStudentCreds] = useState(() => {
    const storedCreds = localStorage.getItem("studentCreds");
    return storedCreds
      ? JSON.parse(storedCreds)
      : {
          creds: null,
          username: "",
          type: ""
        };
  });

  // Update localStorage whenever studentCreds changes
  useEffect(() => {
    localStorage.setItem("studentCreds", JSON.stringify(studentCreds));
  }, [studentCreds]);

  const updateStudentCreds = (creds, username, type) => {
    const newCreds = {
      creds: {
        creds,
        username,
        type
      },
      username,
      type
    };
    setStudentCreds(newCreds);
  };

  const clearStudentCreds = () => {
    const emptyCreds = {
      creds: null,
      username: "",
      type: ""
    };
    setStudentCreds(emptyCreds);
    localStorage.removeItem("studentCreds");
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    return studentCreds && studentCreds.creds && studentCreds.creds.creds;
  };

  // Helper function to get user role
  const getUserRole = () => {
    return studentCreds?.creds?.type || null;
  };

  // Helper function to check if user has specific role
  const hasRole = (requiredRole) => {
    return getUserRole() === requiredRole;
  };

  return (
    <StudentCredContext.Provider
      value={{
        studentCreds,
        updateStudentCreds,
        clearStudentCreds,
        isAuthenticated,
        getUserRole,
        hasRole
      }}
    >
      {children}
    </StudentCredContext.Provider>
  );
};

export default StudentCredProvider;
export { StudentCredProvider, StudentCredContext };
