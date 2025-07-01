import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobListCard from "../components/JobListCard/JobListCard";
import CompanyBanner from "../components/JobSummaryCard";
import AboutWork from "../components/JobDetails";
import StudentDriveForm from "../components/StudentDriveForm";
import ExperienceSection from "../components/ExperienceSection";
import { IoChevronBackOutline } from "react-icons/io5";
import { toastService } from "../components/Toast";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { useStudentDetails } from "../contexts/StudentDetailsContext";
import { fetchStudentDetails } from "../API/fetchStudentDetails";
import { fetchDrives } from "../API/getDrives"; // Add this import
import api from "../API/index.js";

// StudentDrive component manages the student job drive interface
const StudentDrive = () => {
  // URL parameters and navigation
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [selectedCard, setSelectedCard] = useState(id ? parseInt(id) : 1); // Selected job card
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Mobile view detection
  const [display, setDisplay] = useState("1"); // Controls mobile view section (1: list, 2: details)
  const [formDisplay, setFormDisplay] = useState(false); // Application form visibility
  const [editMode, setEditMode] = useState(false); // Edit application mode
  const [showExperiences, setShowExperiences] = useState(false); // Experience section visibility
  const [experiences, setExperiences] = useState([]); // Drive experiences
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Context for student data and credentials
  const { studentData, setStudentData } = useStudentDetails();
  const { studentCreds } = useContext(StudentCredContext);

  // Get the selected drive based on the selectedCard state
  const selectedDrive = drives.find((drive) => drive._id === selectedCard);

  // Fetch student details if not already loaded
  useEffect(() => {
    const loadStudentDetails = async () => {
      if (studentData && studentData.roll_no) {
        console.log(
          "Student data already loaded, skipping fetch:",
          studentData
        );
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
          toastService.error(
            (response && response.message) || "Failed to load student details"
          );
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        toastService.error("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    loadStudentDetails();
  }, [setStudentData, studentData]);

  // Fetch drives data
  useEffect(() => {
    const loadDrives = async () => {
      try {
        const data = await fetchDrives(1, 100); // Fetch first 100 drives
        setDrives(data.drives);

        // If we have an ID from the URL, make sure it's in the proper format
        if (id) {
          // Check if the ID is a number or string ID
          const formattedId = isNaN(id) ? id : parseInt(id);
          setSelectedCard(formattedId);
        }
      } catch (error) {
        console.error("Error loading drives:", error);
        toastService.error("Failed to load drives");
      } finally {
        setLoading(false);
      }
    };
    loadDrives();
  }, [id]);

  // Fetch drive experiences when a drive is selected
  useEffect(() => {
    const fetchExperiences = async () => {
      if (!selectedCard) return;

      try {
        const response = await api.get(
          `student/drive/experiences/${selectedCard}`
        );
        setExperiences(response.data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

    fetchExperiences();
  }, [selectedCard]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && id) {
      setDisplay("2");
    }
  }, [isMobile, id]);

  // Handle job card selection
  const handleCardClick = (id) => {
    setSelectedCard(id);
    navigate(`/drive/${id}`);
    if (isMobile) {
      setDisplay("2"); // Switch to details view on mobile
    }
    // Reset view states when changing drives
    setFormDisplay(false);
    setEditMode(false);
    setShowExperiences(false);
  };

  // Handle apply button click
  const handleApplyClick = () => {
    if (selectedDrive && selectedDrive.isActive) {
      setFormDisplay(true);
      setEditMode(false);
      setShowExperiences(false);
    } else {
      toastService.warning("This drive is no longer accepting applications");
    }
  };

  // Handle view application button click
  const handleViewApplicationClick = () => {
    setFormDisplay(true);
    setEditMode(false);
    setShowExperiences(false);
  };

  // Handle edit application button click
  const handleEditApplicationClick = () => {
    if (selectedDrive && selectedDrive.isActive) {
      setFormDisplay(true);
      setEditMode(true);
      setShowExperiences(false);
    } else {
      toastService.warning(
        "This drive is no longer accepting application edits"
      );
    }
  };

  // Toggle application form visibility
  const toggleFormDisplay = () => {
    setFormDisplay(!formDisplay);
    if (formDisplay) {
      setShowExperiences(false);
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Determine which buttons to show based on drive status and application status
  const renderActionButtons = () => {
    if (!selectedDrive) return null;

    const { isActive, hasApplied } = selectedDrive;

    return (
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-4 mb-8 px-2 sm:px-4">
        {/* Show different buttons based on drive status and whether student has applied */}
        {isActive ? (
          // Active drive
          hasApplied ? (
            // Student has already applied to active drive
            <>
              <button
                className="button-31 w-full sm:w-auto"
                onClick={handleViewApplicationClick}
              >
                View Application
              </button>
              <button
                className="button-31 w-full sm:w-auto"
                onClick={handleEditApplicationClick}
              >
                Edit Application
              </button>
            </>
          ) : (
            // Student has not applied to active drive
            <button
              className="button-31 w-full sm:w-auto"
              onClick={handleApplyClick}
            >
              Apply Now
            </button>
          )
        ) : // Inactive drive
        hasApplied ? (
          // Student has applied to inactive drive
          <button
            className="button-31 w-full sm:w-auto"
            onClick={handleViewApplicationClick}
          >
            View Application
          </button>
        ) : (
          // Student has not applied to inactive drive
          <button className="button-31 w-full sm:w-auto" disabled>
            Drive Closed
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-white">
        <Navbar />
      </div>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="flex w-full h-full overflow-hidden">
          {/* Left Panel: List of Drives */}
          {(!isMobile || display === "1") && (
            <div
              className={`${
                isMobile ? "w-full" : "w-[40%]"
              } h-full flex flex-col border-r border-gray-200`}
            >
              {/* Header for Left Panel */}
              <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Available Drives
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {drives.length} {drives.length === 1 ? "drive" : "drives"}{" "}
                  found
                </p>
              </div>

              {/* Scrollable Drive List */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="space-y-1">
                  {drives.map((drive) => (
                    <div
                      key={drive._id}
                      className={`cursor-pointer transition-all duration-200 border-l-4 ${
                        selectedCard === drive._id
                          ? "bg-coral-red/10 border-l-coral-red shadow-sm"
                          : "bg-white border-l-transparent hover:bg-gray-50 hover:border-l-gray-300"
                      }`}
                      onClick={() => handleCardClick(drive._id)}
                    >
                      <JobListCard job={drive} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right Panel: Drive Details */}
          {(!isMobile || display === "2") && (
            <div
              className={`${
                isMobile ? "w-full" : "w-[60%]"
              } h-full flex flex-col overflow-hidden`}
            >
              {isMobile && (
                <button
                  className="flex items-center gap-1 m-2 h-[1.5rem] text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
                  onClick={() => {
                    if (display === "2") {
                      setDisplay("1");
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                >
                  <IoChevronBackOutline />
                  <span>Back</span>
                </button>
              )}

              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {selectedDrive ? (
                  <>
                    <CompanyBanner job={selectedDrive} />
                    {formDisplay ? (
                      <StudentDriveForm
                        details={studentData}
                        drive={selectedDrive}
                        editMode={editMode}
                        onBack={() => setFormDisplay(false)}
                      />
                    ) : (
                      <>
                        <AboutWork
                          details={selectedDrive}
                          studentInfo={studentData}
                        />

                        {/* Display experiences section below the job details */}
                        <ExperienceSection
                          driveId={selectedDrive._id}
                          experiences={experiences}
                          setExperiences={setExperiences}
                          hasApplied={selectedDrive.hasApplied}
                          isActive={selectedDrive.isActive}
                        />
                      </>
                    )}

                    {/* Display action buttons */}
                    {!formDisplay && renderActionButtons()}
                  </>
                ) : (
                  <div className="flex justify-center items-center h-full p-4">
                    <div className="text-xl font-semibold text-center">
                      Select a drive to view details
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDrive;
