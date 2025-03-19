// Pages/CoordinatorDashboard.js
import React, { useState } from "react";
import NavbarCal from "../components/NavbarCal";
import Filter from "../components/Filter";
import CoordinatorMain from "../components/CoordinatorMain";
import Calendar from "../components/Calender";
import SidebarWithCalendar from "../components/SidebarWithCalender";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import { CalendarProvider } from "../components/CalenderContext";
import { StudentCredContext } from "../contexts/StudentCredContext";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useEffect,useContext } from "react";
function CoordinatorDashboard() {
  // State management for toggling components
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
 
    const { studentCreds } = useContext(StudentCredContext);
    const { creds, type, username } = studentCreds?.creds || {};
    const userId = creds;
    const userType = type;
  // Toggle functions
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilter = () => setFilterOpen(!filterOpen);
  const toggleCalendar = () => setCalendarOpen(!calendarOpen);
  const handleSearch = (term) => setSearchTerm(term);
 // Authentication check using useEffect
  useEffect(() => {
    console.log("CoordinatorDashboard - Checking authentication - studentCreds:", studentCreds);
    if (!studentCreds || !studentCreds.creds || !studentCreds.creds.creds) {
      console.log("No studentCreds found, redirecting to /login");
      toast.error("You must be logged in to access the dashboard.");
      navigate("/login", { replace: true });
      console.log(userId)
      return;
    }
    
    if (!userId) {
      console.log("No userId found, redirecting to /login");
      toast.error("You must be logged in to access the dashboard.");
      navigate("/login", { replace: true });
    } else if (userType !== "coordinator") {
      // console.log("User is not a student, redirecting to:", userType === "coordinator" ? "/coordinator/dashboard" : "/");
      toast.error("Only coordinator can access this dashboard.");
      navigate(userType === "coordinator" ? "/coordinator/dashboard" : "/", { replace: true });
    } else {
      console.log("User authenticated as coordinator, proceeding");
    }
  }, [studentCreds, userId, userType, navigate]);
  return (
    <CalendarProvider>
      <div className="App">
        {/* Navbar with sidebar toggle and search functionality */}
        <NavbarCal toggleSidebar={toggleSidebar} onSearch={handleSearch} />
        <hr />

        {/* Mobile toggle buttons for filter and calendar */}
        <div className="md:hidden p-4 mx-7 flex justify-between">
          <button
            onClick={toggleFilter}
            className="flex items-center gap-2 bg-white border-black border-2 text-black p-2 px-4 rounded-full"
          >
            <FaFilter /> {filterOpen ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={toggleCalendar}
            className="flex items-center gap-2 bg-white border-black border-2 text-black p-2 px-4 rounded-full"
          >
            <FaCalendarAlt /> {calendarOpen ? "Hide Calendar" : "Show Calendar"}
          </button>
        </div>

        {/* Main layout */}
        <div className="flex flex-col md:flex-row mx-5">
          {/* Filter section: hidden on mobile unless toggled, always shown on desktop */}
          <div className={`${filterOpen ? "block" : "hidden"} md:block`}>
            <Filter />
          </div>

          {/* Main content area with coordinator job drives */}
          <div className="flex-grow">
            <CoordinatorMain searchTerm={searchTerm} />
          </div>

          {/* Calendar: shown on desktop */}
          <div className="hidden md:block">
            <Calendar />
          </div>

          {/* Sidebar: conditionally rendered based on isSidebarOpen */}
          <SidebarWithCalendar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Calendar modal for mobile */}
        {calendarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <Calendar onClose={() => setCalendarOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </CalendarProvider>
  );
}

export default CoordinatorDashboard;
