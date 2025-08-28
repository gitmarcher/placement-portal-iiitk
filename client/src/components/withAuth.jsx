// src/components/withAuth.jsx
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toastService } from "./Toast";
import { StudentCredContext } from "../contexts/StudentCredContext";

const withAuth = (WrappedComponent, allowedRole = null) => {
  const AuthComponent = (props) => {
    const { studentCreds } = useContext(StudentCredContext);
    const { creds: userId, type: userType } = studentCreds || {};
    const navigate = useNavigate();

    useEffect(() => {
      console.log("withAuth - studentCreds:", studentCreds);
      if (!userId) {
        console.log("Not authenticated, redirecting to /login");
        toastService.error("You must be logged in to access this page");
        navigate("/", { replace: true });
      } else if (allowedRole && userType !== allowedRole) {
        console.log(`Role mismatch: ${userType} !== ${allowedRole}`);
        toastService.error(`Only ${allowedRole}s can access this page`);
        navigate(
          userType === "coordinator" ? "/coordinator/dashboard" : "/dashboard",
          { replace: true }
        );
      }
    }, [userId, userType, navigate, allowedRole]);

    if (!userId || (allowedRole && userType !== allowedRole)) {
      return null; // Prevent rendering while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthComponent;
};

export default withAuth;
