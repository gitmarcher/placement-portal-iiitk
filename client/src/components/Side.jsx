// src/components/Side.jsx
import React, { useContext } from "react";
import { useStudentDetails } from "../contexts/StudentDetailsContext";
import { Link, useNavigate } from "react-router-dom";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { toast } from "react-toastify";
import { logout } from "../API/authentication"; // Import logout

const Sidebar = ({ onToggleCalendar }) => {
  const { studentData } = useStudentDetails();
  const studentName = studentData.name || "Student";
  const { updateStudentCreds } = useContext(StudentCredContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await logout();

      if (response.success) {
        // Clear student credentials
        updateStudentCreds(null, null);
        
        toast.success(response.message || "Logged out successfully!");
        navigate("/login"); // Redirect to login page
      } else {
        toast.error(response.message || "Logout failed");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
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
          <p className="font-semibold text-gray-800">{studentName}</p>
          <p className="text-sm text-blue-500 cursor-pointer">
            <Link to="/profile">View Profile</Link>
          </p>
        </div>
      </div>
      <nav>
        <ul className="space-y-2 flex flex-col items-center justify-center">
          <li className="py-2 border-b border-black w-full text-center">
            <Link to="/dashboard">Dashboard</Link>
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