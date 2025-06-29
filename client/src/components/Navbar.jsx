import React, { useContext } from "react";
import { logo } from "../assets";
import { Link, useNavigate } from "react-router-dom";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { logout } from "../API/authentication";
import { toastService } from "./Toast";

const Navbar = () => {
  const { studentCreds, updateStudentCreds } = useContext(StudentCredContext);
  const navigate = useNavigate();

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    const userRole = studentCreds?.type;
    return userRole === "coordinator" ? "/coordinator/dashboard" : "/dashboard";
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await logout();

      if (response.success) {
        // Clear student credentials from context and localStorage
        updateStudentCreds("", "", "");
        localStorage.removeItem("studentCreds");

        toastService.success(response.message || "Logged out successfully");
        navigate("/login"); // Redirect to login page
      } else {
        toastService.error(response.message || "Logout failed");
      }
    } catch (error) {
      toastService.error("Logout failed. Please try again");
      console.error("Logout error:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Get user role
  const userRole = studentCreds?.type;
  const isCoordinator = userRole === "coordinator";

  return (
    <nav className="py-6 px-6 shadow-md bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Back button */}
          <Link to={getDashboardUrl()} className="text-gray-500 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Logo and title */}
          <Link to={getDashboardUrl()} className="flex items-center gap-x-2">
            <img src={logo} alt="Logo" className="h-8" />
            <h1 className="text-gray-900 font-medium text-lg">
              Placement Portal
            </h1>
          </Link>
        </div>

        {/* Right side navigation buttons */}
        <div className="flex items-center space-x-4">
          {!isCoordinator && (
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-coral-red hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="hidden sm:inline">Profile</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-white bg-coral-red hover:bg-coral-red/90 rounded-lg transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
