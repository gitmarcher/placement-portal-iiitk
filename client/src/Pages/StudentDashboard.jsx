// src/components/StudentDashboard.js
import React, { useState, useEffect, useContext } from "react";
import NavbarCal from "../components/NavbarCal";
import Filter from "../components/Filter";
import Main from "../components/Main";
import SidebarWithCalendar from "../components/SidebarWithCalender";
import Calendar from "../components/Calender";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import { CalendarProvider } from "../components/CalenderContext";
import { useStudentDetails } from "../contexts/StudentDetailsContext";
import { fetchStudentDetails } from "../API/fetchStudentDetails";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// StudentDashboard component manages the student dashboard view
function StudentDashboard() {
  // State management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility
  const [filterOpen, setFilterOpen] = useState(false); // Filter visibility (mobile)
  const [calendarOpen, setCalendarOpen] = useState(false); // Calendar visibility (mobile)
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [loading, setLoading] = useState(true); // Loading state

  // Context and hooks
  const { studentData, setStudentData } = useStudentDetails();
  const { studentCreds } = useContext(StudentCredContext);
  const { creds, type, username } = studentCreds?.creds || {};
  const userId = creds;
  const userType = type;
  const navigate = useNavigate();

  // Log student credentials for debugging
  console.log("StudentDashboard - studentCreds:", userId, userType, username);

  // Authentication validation on mount
  useEffect(() => {
    console.log("StudentDashboard - Checking authentication - studentCreds:", studentCreds);
    if (!studentCreds || !studentCreds.creds || !studentCreds.creds.creds) {
      console.log("No studentCreds found, redirecting to /login");
      toast.error("You must be logged in to access the dashboard.");
      navigate("/login", { replace: true });
      return;
    }

    if (!userId) {
      console.log("No userId found, redirecting to /login");
      toast.error("You must be logged in to access the dashboard.");
      navigate("/login", { replace: true });
    } else if (userType !== "student") {
      console.log("User is not a student, redirecting to:", userType === "coordinator" ? "/coordinator/dashboard" : "/");
      toast.error("Only students can access this dashboard.");
      navigate(userType === "coordinator" ? "/coordinator/dashboard" : "/", { replace: true });
    } else {
      console.log("User authenticated as student, proceeding");
    }
  }, [studentCreds, userId, userType, navigate]);

  // Fetch student details when authenticated
  useEffect(() => {
    const loadStudentDetails = async () => {
      if (studentData && studentData.roll_no) {
        console.log("Student data already loaded, skipping fetch:", studentData);
        setLoading(false);
        return;
      }

      if (!userId) {
        console.log("No userId available for fetching details");
        return;
      }

      try {
        setLoading(true);
        const response = await fetchStudentDetails();
        console.log("Raw backend response:", response);

        if (response && response.success) {
          const backendData = response.data;
          console.log("Backend data assigned:", backendData);
          setStudentData(backendData);
          console.log("Student details set in context:", backendData);
        } else {
          console.error("Failed to fetch student details:", response?.message);
          toast.error((response && response.message) || "Failed to load student details.");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast.error("Error loading student details.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && userType === "student") {
      loadStudentDetails();
    }
  }, [userId, userType, setStudentData, studentData]);

  // Toggle functions for UI elements
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilter = () => setFilterOpen(!filterOpen);
  const toggleCalendar = () => setCalendarOpen(!calendarOpen);
  const handleSearch = (term) => setSearchTerm(term);

  // Loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading student details...</div>
      </div>
    );
  }

  // Safety check for unauthorized access
  if (!userId || userType !== "student") {
    return null; // Redirect should handle this, but kept as fallback
  }

  return (
    <CalendarProvider>
      {/* Toast notifications container */}
      <ToastContainer />
      
      <div className="App">
        {/* Navigation bar with search and sidebar toggle */}
        <NavbarCal toggleSidebar={toggleSidebar} onSearch={handleSearch} />
        <hr />

        {/* Mobile-specific filter and calendar toggle buttons */}
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
          {/* Filter section - toggleable on mobile */}
          <div className={`${filterOpen ? "block" : "hidden"} md:block`}>
            <Filter />
          </div>

          {/* Main content area */}
          <div className="flex-grow">
            <Main searchTerm={searchTerm} studentDetails={studentData} />
          </div>

          {/* Calendar - always visible on desktop */}
          <div className="hidden md:block">
            <Calendar />
          </div>

          {/* Sidebar with calendar */}
          <SidebarWithCalendar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Mobile calendar overlay */}
        {calendarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <Calendar onClose={() => setCalendarOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </CalendarProvider>
  );
}

export default StudentDashboard;