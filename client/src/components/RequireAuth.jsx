import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Optional: for user feedback
import { StudentCredContext } from "../contexts/StudentCredContext";

const RequireAuth = ({ children, allowedRole }) => {
  const { studentCreds } = useContext(StudentCredContext);
  const { creds: userId,username, type } = studentCreds || {};
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    if (!userId) {
      toast.error("You must be logged in to access this page."); // Optional
      navigate("/login", { replace: true });
      return;
    }

    // Check if the user has the required role (if specified)
      if (allowedRole && type !== allowedRole) {
        console.log("Type", type);
        console.log("Allowed Role", allowedRole);
      toast.error(`Only ${allowedRole}s can access this page.`); // Optional
      navigate("/dashboard", { replace: true });
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