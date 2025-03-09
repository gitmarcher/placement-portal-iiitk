import React, { useState } from "react";
import { ArrowLeft, Edit } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import ProfileHelperComponent from "../components/Profile";
import Navbar from "../components/Navbar";

const Profile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      <div className="flex-grow">
        <ProfileHelperComponent />
      </div>
    </div>
  );
};

export default Profile;
