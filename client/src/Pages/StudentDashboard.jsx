// src/components/StudentDashboard.js
import React, { useState, useEffect, useContext } from "react";
import NavbarCal from "../components/NavbarCal";
import Filter from "../components/Filter";
import Main from "../components/Main";
import Calendar from "../components/Calender";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import { CalendarProvider } from "../components/CalenderContext";
import { useStudentDetails } from "../contexts/StudentDetailsContext";
import { fetchStudentDetails } from "../API/fetchStudentDetails";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { useNavigate } from "react-router-dom";

// StudentDashboard component manages the student dashboard view
function StudentDashboard() {
  // State management
  const [filterOpen, setFilterOpen] = useState(false); // Filter visibility (mobile)
  const [calendarOpen, setCalendarOpen] = useState(false); // Calendar visibility (mobile)
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [loading, setLoading] = useState(true); // Loading state

  // Filter state management
  const [filters, setFilters] = useState({
    searchRole: "",
    status: [],
    type: [],
    location: [],
    locationSearch: "",
    batch: []
  });

  // Context and hooks
  const navigate = useNavigate();
  const { studentData, setStudentData } = useStudentDetails();
  const { studentCreds } = useContext(StudentCredContext);

  // Fetch student details when component mounts
  useEffect(() => {
    const loadStudentDetails = async () => {
      if (studentData && studentData.roll_no) {
        console.log(
          "Student data already loaded, skipping fetch:",
          studentData
        );
        setLoading(false);
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
          // Error already handled by the updated files
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        // Error already handled by the updated files
      } finally {
        setLoading(false);
      }
    };

    loadStudentDetails();
  }, [setStudentData, studentData]);

  // Toggle functions for UI elements
  const toggleFilter = () => setFilterOpen(!filterOpen);
  const toggleCalendar = () => setCalendarOpen(!calendarOpen);
  const handleSearch = (term) => setSearchTerm(term);
  const handleFiltersChange = (newFilters) => setFilters(newFilters);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((filter) =>
    Array.isArray(filter) ? filter.length > 0 : Boolean(filter)
  );

  // Loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading student details...</div>
      </div>
    );
  }

  return (
    <CalendarProvider userRole="student">
      <div className="App">
        {/* Navigation bar with search */}
        <NavbarCal onSearch={handleSearch} />
        <hr />

        {/* Mobile-specific filter and calendar toggle buttons */}
        <div className="md:hidden p-4 mx-7 flex gap-2">
          <button
            onClick={toggleFilter}
            className={`flex items-center gap-2 border-2 p-2 px-4 rounded-full transition-colors ${
              filterOpen
                ? "bg-coral-red text-white border-coral-red"
                : hasActiveFilters
                ? "bg-white text-coral-red border-coral-red"
                : "bg-white text-black border-black"
            }`}
          >
            <FaFilter /> {filterOpen ? "Hide Filters" : "Show Filters"}
            {hasActiveFilters && !filterOpen && (
              <span className="bg-coral-red text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                •
              </span>
            )}
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
            <Filter
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </div>

          {/* Main content area */}
          <div className="flex-grow">
            <Main
              searchTerm={searchTerm}
              studentDetails={studentData}
              filters={filters}
            />
          </div>

          {/* Calendar - always visible on desktop */}
          <div className="hidden md:block">
            <Calendar />
          </div>
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
