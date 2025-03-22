// src/components/Profile.js
import React, { useState, useEffect, useContext } from "react";
import { ArrowLeft, Edit } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import ProfileHelperComponent from "../components/Profile";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StudentCredContext } from "../contexts/StudentCredContext";

// Profile component manages the student profile view
const Profile = () => {
  // Hooks and navigation
  const navigate = useNavigate();
  
  // Access student credentials from context
  const { studentCreds } = useContext(StudentCredContext);
  const { creds: userId, type: userType, username } = studentCreds ? studentCreds.creds : {};

  // Authentication and role validation on mount
  useEffect(() => {
    if (!userType) {
      // Redirect to login if not authenticated
      toast.error("You must be logged in to view profile.");
      navigate("/login", { replace: true });
    } else if (userType !== "student") {
      // Redirect coordinators to their dashboard
      toast.error("Only students can view profile.");
      navigate("/dashboard/coordinator", { replace: true });
    }
  }, [userId, userType, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky navigation bar */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      
      {/* Main content area */}
      <div className="flex-grow">
        <ProfileHelperComponent />
      </div>
    </div>
  );
};

export default Profile;