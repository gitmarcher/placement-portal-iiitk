// src/components/Side.jsx
import React, { useContext } from "react";
import { useStudentDetails } from "../contexts/StudentDetailsContext";
import { Link, useNavigate } from "react-router-dom";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { toastService } from "./Toast";
import { logout } from "../API/authentication"; // Import logout

const Sidebar = ({ onToggleCalendar }) => {
  const { studentData } = useStudentDetails();
  const { updateStudentCreds, studentCreds } = useContext(StudentCredContext);
  const navigate = useNavigate();

  // Get user name and role-appropriate display
  const getUserDisplayInfo = () => {
    const userRole = studentCreds?.type;
    if (userRole === "coordinator") {
      return {
        name: studentData.name || "Coordinator",
        displayRole: "Coordinator"
      };
    } else {
      return {
        name: studentData.name || "Student",
        displayRole: "Student"
      };
    }
  };

  const userInfo = getUserDisplayInfo();

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

  return (
    <div className="w-80 bg-[#DDDDDD] p-4 rounded-lg">
      <div className="flex items-center mb-6">
        <div className="mr-3">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{userInfo.name}</p>
          <p className="text-sm text-blue-500 cursor-pointer">
            <Link to="/profile">View Profile</Link>
          </p>
        </div>
      </div>
      <nav>
        <ul className="space-y-2 flex flex-col items-center justify-center">
          <li className="py-2 border-b border-black w-full text-center">
            <Link to={getDashboardUrl()}>Dashboard</Link>
          </li>
          <li
            className="py-2 border-b border-black w-full text-center cursor-pointer"
            onClick={onToggleCalendar}
          >
            Calendar
          </li>
          <li
            className="py-2 border-b border-black w-full text-center cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
