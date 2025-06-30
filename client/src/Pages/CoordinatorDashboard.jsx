// Pages/CoordinatorDashboard.js
import React, { useState, useEffect, useContext } from "react";
import NavbarCal from "../components/NavbarCal";
import Filter from "../components/Filter";
import CoordinatorMain from "../components/CoordinatorMain";
import Calendar from "../components/Calender";
import SidebarWithCalendar from "../components/SidebarWithCalender";
import PlacementTracker from "../components/PlacementTracker";
import {
  FaFilter,
  FaCalendarAlt,
  FaPlus,
  FaChartBar,
  FaListAlt
} from "react-icons/fa";
import { CalendarProvider } from "../components/CalenderContext";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { useNavigate } from "react-router-dom";

function CoordinatorDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("drives"); // Tab navigation (drives, tracker)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility
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
    batch: ""
  });

  // Context and hooks
  const navigate = useNavigate();
  const { studentCreds } = useContext(StudentCredContext);

  // Initialize component (simulate loading for consistency)
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);
        // Add a small delay to match student dashboard behavior
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error initializing coordinator dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, []);

  // Toggle functions for UI elements
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilter = () => setFilterOpen(!filterOpen);
  const toggleCalendar = () => setCalendarOpen(!calendarOpen);
  const handleSearch = (term) => setSearchTerm(term);
  const handleFiltersChange = (newFilters) => setFilters(newFilters);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((filter) =>
    Array.isArray(filter) ? filter.length > 0 : Boolean(filter)
  );

  // Navigation handlers
  const handleAddDrive = () => {
    navigate("/coordinator/add-drive");
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">
          Loading coordinator dashboard...
        </div>
      </div>
    );
  }

  return (
    <CalendarProvider userRole="coordinator">
      <div className="App">
        {/* Navigation bar with search */}
        <NavbarCal onSearch={handleSearch} />
        <hr />

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 mx-5 mt-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("drives")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "drives"
                  ? "border-coral-red text-coral-red"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaListAlt />
                Drive Management
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tracker")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "tracker"
                  ? "border-coral-red text-coral-red"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaChartBar />
                Placement Tracker
              </div>
            </button>
          </div>
        </div>

        {/* Mobile-specific filter, calendar toggle buttons, and add drive - only for drives tab */}
        {activeTab === "drives" && (
          <>
            <div className="md:hidden p-4 mx-7 flex flex-wrap gap-2 justify-between">
              <div className="flex gap-2">
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
                  <FaCalendarAlt />{" "}
                  {calendarOpen ? "Hide Calendar" : "Show Calendar"}
                </button>
              </div>
              <button
                onClick={handleAddDrive}
                className="flex items-center gap-2 bg-coral-red text-white p-2 px-4 rounded-full hover:bg-coral-red/90 transition-colors"
              >
                <FaPlus /> Add Drive
              </button>
            </div>

            {/* Desktop Add Drive button */}
            <div className="hidden md:block p-4 mx-5">
              <button
                onClick={handleAddDrive}
                className="flex items-center gap-2 bg-coral-red text-white p-3 px-6 rounded-full hover:bg-coral-red/90 transition-colors shadow-md"
              >
                <FaPlus /> Add New Drive
              </button>
            </div>
          </>
        )}

        {/* Main layout */}
        {activeTab === "drives" ? (
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
              <CoordinatorMain searchTerm={searchTerm} filters={filters} />
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
        ) : (
          /* Placement Tracker */
          <div className="mx-5">
            <PlacementTracker />
          </div>
        )}

        {/* Mobile calendar overlay - only for drives tab */}
        {activeTab === "drives" && calendarOpen && (
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

export default CoordinatorDashboard;
