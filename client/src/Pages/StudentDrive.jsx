import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobListCard from "../components/JobListCard/JobListCard";
import CompanyBanner from "../components/JobSummaryCard";
import AboutWork from "../components/JobDetails";
import StudentDriveForm from "../components/StudentDriveForm";
import ExperienceSection from "../components/ExperienceSection";
import { IoChevronBackOutline } from "react-icons/io5";
import { fetchDrives } from "../API/getDrives";
import { useStudentDetails } from "../contexts/StudentDetailsContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDrive = () => {
  const { id } = useParams(); // Get drive ID from URL
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(id); // Initialize with URL id
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [display, setDisplay] = useState("1");
  const [formDisplay, setFormDisplay] = useState(false);
  const [drives, setDrives] = useState([]); // State for fetched drives
  const [loading, setLoading] = useState(true); // Loading state
  const { studentData } = useStudentDetails(); // Get student data from context

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch drives from backend on component mount
  useEffect(() => {
    const loadDrives = async () => {
      try {
        const data = await fetchDrives(1, 100); // Fetch first 100 drives
        setDrives(data.drives);
      } catch (error) {
        console.error("Error loading drives:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDrives();
  }, []);

  // Set display to details view on mobile if ID is provided
  useEffect(() => {
    if (isMobile && id) {
      setDisplay("2");
    }
  }, [isMobile, id]);

  // Handle clicking a drive card
  const handleCardClick = (driveId) => {
    setSelectedCard(driveId);
    navigate(`/drive/${driveId}`);
    if (isMobile) {
      setDisplay("2");
    }
  };

  const toggleFormDisplay = () => setFormDisplay(!formDisplay);

  // Render loading state
  if (loading) {
    return <div>Loading drives...</div>;
  }

  // Find the selected drive based on ID
  const selectedDrive = drives.find((drive) => drive._id === selectedCard);

  return (
    <>
      <ToastContainer />
      <div className="sticky top-0 z-10 bg-white">
        <Navbar />
      </div>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="flex w-full h-full overflow-hidden">
          {/* Left Panel: List of Drives */}
          {(!isMobile || display === "1") && (
            <div
              className={`${
                isMobile ? "w-full" : "w-[35%]"
              } h-full flex mt-3 flex-col`}
            >
              <div className="flex-1 overflow-y-auto">
                {drives.map((drive) => (
                  <div
                    key={drive._id}
                    className={`cursor-pointer ${
                      selectedCard === drive._id
                        ? "bg-coral-red/20"
                        : "bg-white"
                    }`}
                    onClick={() => handleCardClick(drive._id)}
                  >
                    <JobListCard job={drive} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Panel: Drive Details */}
          {(!isMobile || display === "2") && (
            <div
              className={`${
                isMobile ? "w-full" : "w-[65%]"
              } h-full flex flex-col`}
            >
              {isMobile && (
                <button
                  className="flex items-center gap-1 m-2 h-[1.5rem]"
                  onClick={() => setDisplay("1")}
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
                      <StudentDriveForm details={studentData} />
                    ) : (
                      <AboutWork
                        details={selectedDrive}
                        studentInfo={studentData}
                      />
                    )}
                    <div className="flex w-full justify-center mt-4">
                      <button
                        className="button-31 pt-4"
                        onClick={toggleFormDisplay}
                      >
                        {formDisplay ? "Back to details" : "View application"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div>Drive not found</div>
                )}
                <ExperienceSection />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDrive;
