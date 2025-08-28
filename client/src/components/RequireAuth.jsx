import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toastService } from "./Toast"; // Optional: for user feedback
import { StudentCredContext } from "../contexts/StudentCredContext";

const RequireAuth = ({ children, allowedRole }) => {
  const { studentCreds } = useContext(StudentCredContext);
  const { creds: userId, username, type } = studentCreds || {};
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    if (!userId) {
      toastService.error("You must be logged in to access this page"); // Optional
      navigate("/", { replace: true });
      return;
    }

    // Check if the user has the required role (if specified)
    if (allowedRole && type !== allowedRole) {
      console.log("Type", type);
      console.log("Allowed Role", allowedRole);
      toastService.error(`Only ${allowedRole}s can access this page`); // Optional
      // Navigate to appropriate dashboard based on user's actual role
      if (type === "coordinator") {
        navigate("/coordinator/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      return;
    }
  }, [userId, type, allowedRole, navigate]); // Dependencies for useEffect

  // If the user is authenticated and has the correct role, render children
  // Only render if checks pass (avoid rendering during redirect)
  if (!userId || (allowedRole && type !== allowedRole)) {
    return null; // Return null while redirecting
  }

  return children;
};

export default RequireAuth;
