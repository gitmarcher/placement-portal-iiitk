// src/Dashboard.js
import React, { useState, useEffect } from "react";
import NavbarCal from "../components/NavbarCal";
import Filter from "../components/Filter";
import Main from "../components/Main";
import SidebarWithCalendar from "../components/SidebarWithCalender";
import Calendar from "../components/Calender";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import { CalendarProvider } from "../components/CalenderContext";
import { useStudentDetails } from "../contexts/StudentDetailsContext";
import { fetchStudentDetails } from "../API/fetchStudentDetails";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Local loading state

  // Destructure from context
  const { studentData, setStudentData } = useStudentDetails();

  useEffect(() => {
    const loadStudentDetails = async () => {
      if (studentData.roll_no) {
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
        console.log("Raw backend response (pre-processed):", response.data);

        // Ensure response.data is what we expect
        const backendData = response.data;
        console.log("Backend data assigned:", backendData);

        if (response.success) {
          // Set directly without merging to test raw data
          setStudentData(backendData);
          console.log("Student details set in context (direct):", backendData);
        } else {
          console.error("Failed to fetch student details:", response.message);
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentDetails();
  }, [setStudentData]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilter = () => setFilterOpen(!filterOpen);
  const toggleCalendar = () => setCalendarOpen(!calendarOpen);
  const handleSearch = (term) => setSearchTerm(term);

  if (loading) {
    return <div>Loading student details...</div>;
  }

  return (
    <CalendarProvider>
      <div className="App">
        <NavbarCal toggleSidebar={toggleSidebar} onSearch={handleSearch} />
        <hr />
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
        <div className="flex flex-col md:flex-row mx-5">
          <div className={`${filterOpen ? "block" : "hidden"} md:block`}>
            <Filter />
          </div>
          <div className="flex-grow">
            <Main searchTerm={searchTerm} studentDetails={studentData} />
          </div>
          <div className="hidden md:block">
            <Calendar />
          </div>
          <SidebarWithCalendar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
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

export default Dashboard;
