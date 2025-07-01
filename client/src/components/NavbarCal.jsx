import React, { useState, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import logo from "../assets/Placement Portal/IIITK-Logo.png";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../API/authentication";
import { toastService } from "./Toast";

const NavbarCal = ({ onSearch }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { studentCreds, updateStudentCreds } = useContext(StudentCredContext);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await logout();

      if (response.success) {
        // Clear authentication state from context (no localStorage operations)
        updateStudentCreds("", "", "");

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
    <nav className="flex items-center justify-between p-4 bg-white shadow-md relative w-full">
      <div className="flex items-center">
        <div>
          <img src={logo} alt="logo" className="w-10 h-10" />
        </div>
        <div className="font-bold text-2xl ml-2">Placement Portal</div>
      </div>

      <div className="relative flex items-center w-full max-w-md mx-auto hidden custom:flex">
        <FaSearch className="absolute left-3 text-red-400" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-[#DDDDDD] placeholder-placeholder-red"
        />
      </div>

      {/* Desktop Navigation Buttons */}
      <div className="hidden custom:flex space-x-4 items-center">
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
            Profile
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
          Log out
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="flex items-center custom:hidden">
        <FaSearch
          className="text-xl mr-4 cursor-pointer"
          onClick={() => setShowSearch(!showSearch)}
        />
        <div className="flex space-x-2">
          {!isCoordinator && (
            <button
              onClick={handleProfileClick}
              className="p-2 text-gray-700 hover:text-coral-red hover:bg-gray-50 rounded-lg transition-all duration-200"
              title="Profile"
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
            </button>
          )}
          <button
            onClick={handleLogout}
            className="p-2 text-white bg-coral-red hover:bg-coral-red/90 rounded-lg transition-all duration-200"
            title="Log out"
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
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="absolute top-full left-0 right-0 bg-white p-4 custom:hidden z-10">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-red-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-[#DDDDDD] placeholder-placeholder-red"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarCal;
