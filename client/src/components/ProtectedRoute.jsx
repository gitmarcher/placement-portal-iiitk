import React, { useContext } from "react";
import { StudentCredContext } from "../contexts/StudentCredContext";
import Unauthorized from "./Unauthorized";

const ProtectedRoute = ({ children, requiredRole, currentPath }) => {
  const { studentCreds } = useContext(StudentCredContext);

  // If no credentials, show unauthorized (but don't logout)
  if (!studentCreds || !studentCreds.creds) {
    return <Unauthorized userRole={null} attemptedAccess={currentPath} />;
  }

  const { type: userRole } = studentCreds.creds;

  // If user has the required role, show the component
  if (userRole === requiredRole) {
    return children;
  }

  // If user has different role, show unauthorized page (but don't logout)
  return <Unauthorized userRole={userRole} attemptedAccess={currentPath} />;
};

export default ProtectedRoute;
