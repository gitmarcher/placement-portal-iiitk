// src/components/StudentDrive.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobListCard from "../components/JobListCard/JobListCard";
import CompanyBanner from "../components/JobSummaryCard";
import AboutWork from "../components/JobDetails";
import StudentDriveForm from "../components/StudentDriveForm";
import ExperienceSection from "../components/ExperienceSection";
import { IoChevronBackOutline } from "react-icons/io5";
import { data, job, details, studentInfo } from "../../data";
import styles from "./StudentDrive.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { useStudentDetails } from "../contexts/StudentDetailsContext";
import { fetchStudentDetails } from "../API/fetchStudentDetails";

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
  const [loading, setLoading] = useState(true); // Loading state

  // Context for student data and credentials
  const { studentData, setStudentData } = useStudentDetails();
  const { studentCreds } = useContext(StudentCredContext);
  const { creds, type, username } = studentCreds?.creds || {};
  const userId = creds;
  const userType = type;

  // Log student credentials for debugging
  console.log("StudentDrive - studentCreds:", userId, userType, username);

  // Authentication validation on mount
  useEffect(() => {
    console.log(
      "StudentDrive - Checking authentication - studentCreds:",
      studentCreds
    );
    if (!studentCreds || !studentCreds.creds || !studentCreds.creds.creds) {
      console.log("No studentCreds found, redirecting to /login");
      toast.error("You must be logged in to access this page.");
      navigate("/login", { replace: true });
      return;
    }

    if (!userId) {
      console.log("No userId found, redirecting to /login");
      toast.error("You must be logged in to access this page.");
      navigate("/login", { replace: true });
    } else if (userType !== "student") {
      console.log(
        "User is not a student, redirecting to:",
        userType === "coordinator" ? "/coordinator/dashboard" : "/"
      );
      toast.error("Only students can access this page.");
      navigate(userType === "coordinator" ? "/coordinator/dashboard" : "/", {
        replace: true
      });
    } else {
      console.log("User authenticated as student, proceeding");
      setLoading(false);
    }
  }, [studentCreds, userId, userType, navigate]);

  // Fetch student details if not already loaded
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

      if (!userId) {
        console.log("No userId available for fetching details");
        return;
      }

      try {
        setLoading(true);
        const response = await fetchStudentDetails(userId);
        console.log("Raw backend response:", response);

        if (response && response.success) {
          const backendData = response.data;
          console.log("Backend data assigned:", backendData);
          setStudentData(backendData);
          console.log("Student details set in context:", backendData);
        } else {
          console.error("Failed to fetch student details:", response?.message);
          toast.error(
            (response && response.message) || "Failed to load student details."
          );
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

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle job card selection
  const handleCardClick = (id) => {
    setSelectedCard(id);
    navigate(`/drive/${id}`);
    if (isMobile) {
      setDisplay("2"); // Switch to details view on mobile
    }
  };

  // Toggle application form visibility
  const toggleFormDisplay = () => setFormDisplay(!formDisplay);

  // Loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Safety check for unauthorized access
  if (!userId || userType !== "student") {
    return null; // Redirect should handle this, but kept as fallback
  }

  return (
    <>
      {/* Toast notifications container */}
      <ToastContainer />

      {/* Sticky navigation bar */}
      <div className="sticky top-0 z-10 bg-white">
        <Navbar />
      </div>

      {/* Main content container */}
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="flex w-full h-full overflow-hidden">
          {/* Job List Section - Visible on desktop or mobile list view */}
          {(!isMobile || display === "1") && (
            <div
              className={`${
                isMobile ? "w-full" : "w-[35%]"
              } h-full flex mt-3 flex-col`}
            >
              <div className={`flex-1 overflow-y-auto ${styles.scrollbarHide}`}>
                {data.map((job) => (
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

          {/* Details Section - Visible on desktop or mobile details view */}
          {(!isMobile || display === "2") && (
            <div
              className={`${
                isMobile ? "w-full" : "w-[65%]"
              } h-full flex flex-col`}
            >
              {/* Back button for mobile */}
              {isMobile && (
                <button
                  className="flex items-center gap-1 m-2 h-[1.5rem]"
                  onClick={() => setDisplay("1")}
                >
                  <IoChevronBackOutline />
                  <span>Back</span>
                </button>
              )}

              {/* Job details content */}
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
