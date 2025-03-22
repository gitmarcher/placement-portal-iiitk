import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobListCard from "../components/JobListCard/JobListCard";
import JobSummaryCard from "../components/JobSummaryCard";
import JobDetails from "../components/JobDetails";
import ExperienceSection from "../components/ExperienceSection";
import Results from "../components/Results";
import { IoChevronBackOutline } from "react-icons/io5";
import { BsDownload } from "react-icons/bs";
import { fetchDrives } from "../API/getDrives"; // Adjust path as needed
import styles from "./StudentDrive.module.css";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
const CoordinatorDrive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(id);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentTab, setCurrentTab] = useState("experiences");
  const [display, setDisplay] = useState("1");
  const { studentCreds } = useContext(StudentCredContext);
  // Handle possible null or undefined studentCreds
  const { creds, type, username } = studentCreds?.creds || {};
  const userId = creds;
  const userType = type;

  console.log(
    "CoordinatorDashboard - studentCreds:",
    userId,
    userType,
    username
  );
  useEffect(() => {
    console.log(
      "CoordinatorDashboard - Checking authentication - studentCreds:",
      studentCreds
    );
    if (!studentCreds || !studentCreds.creds || !studentCreds.creds.creds) {
      console.log("No studentCreds found, redirecting to /login");
      toast.error("You must be logged in to access the dashboard.");
      navigate("/login", { replace: true });
      console.log(userId);
      return;
    }

    if (!userId) {
      console.log("No userId found, redirecting to /login");
      toast.error("You must be logged in to access the dashboard.");
      navigate("/login", { replace: true });
    } else if (userType !== "coordinator") {
      // console.log("User is not a student, redirecting to:", userType === "coordinator" ? "/coordinator/dashboard" : "/");
      toast.error("Only coordinator can access this dashboard.");
      navigate(userType === "coordinator" ? "/coordinator/dashboard" : "/", {
        replace: true
      });
    } else {
      console.log("User authenticated as coordinator, proceeding");
    }
  }, [studentCreds, userId, userType, navigate]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      if (width > 768) {
        setDisplay("both");
      } else {
        setDisplay(display === "both" ? "1" : display);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [display]);

  const handleCardClick = (driveId) => {
    setSelectedCard(driveId);
    navigate(`/coordinator/drive/${driveId}`);
    if (isMobile) {
      setDisplay("2");
    }
  };

  const handleTabClick = (event) => setCurrentTab(event.currentTarget.id);

  const selectedDrive =
    drives.find((drive) => drive._id === selectedCard) || {};

  const JobList = () => (
    <div
      className={`${
        styles.scrollbarHide
      } h-[calc(100vh-64px)] overflow-y-auto ${
        isMobile ? "w-full" : "w-[35%]"
      }`}
    >
      {loading ? (
        <div>Loading drives...</div>
      ) : drives.length === 0 ? (
        <div>No drives available</div>
      ) : (
        drives.map((drive) => (
          <div
            key={drive._id}
            className={`cursor-pointer ${
              selectedCard === drive._id ? "bg-coral-red/20" : "bg-white"
            }`}
            onClick={() => handleCardClick(drive._id)}
          >
            <JobListCard
              job={{
                id: drive._id,
                company: drive.company_name || "Unknown Company",
                position: drive.drive_name || "Unknown Position",
                location: Array.isArray(drive.location)
                  ? drive.location.join(", ")
                  : "Not specified",
                type: drive.type_of_role || "Unknown",
                deadline: drive.deadline
                  ? new Date(drive.deadline).toLocaleString()
                  : "Not specified",
                company_logo: drive.company_logo // Use company_logo with fallback
              }}
            />
          </div>
        ))
      )}
    </div>
  );

  const TabSection = () => (
    <div className="mx-4 border-gray-100 p-4 rounded-xl mt-2 mb-2">
      <div className="flex align-middle">
        {["results", "experiences"].map((tab) => (
          <div
            key={tab}
            id={tab}
            className={`flex justify-center border-2 mx-0 ${
              currentTab === tab ? "text-custom-red border-b-custom-red" : ""
            } cursor-pointer border-x-transparent border-t-transparent px-5 py-3`}
            onClick={handleTabClick}
          >
            <h1 className="font-medium text-lg">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );

  const DetailSection = () => (
    <div
      className={`${
        styles.scrollbarHide
      } h-[calc(100vh-64px)] overflow-y-auto ${
        isMobile ? "w-full" : "w-[65%]"
      }`}
    >
      {loading ? (
        <div>Loading drive details...</div>
      ) : !selectedDrive._id ? (
        <div>Please select a drive</div>
      ) : (
        <>
          <JobSummaryCard
            job={{
              id: selectedDrive._id,
              company: selectedDrive.company_name || "Unknown Company",
              position: selectedDrive.drive_name || "Unknown Position",
              location: Array.isArray(selectedDrive.location)
                ? selectedDrive.location.join(", ")
                : "Not specified",
              type: selectedDrive.type_of_role || "Unknown",
              duration: selectedDrive.duration || "Not specified",
              salary: selectedDrive.ctc || "Not specified",
              deadline: selectedDrive.deadline
                ? new Date(selectedDrive.deadline).toLocaleString()
                : "Not specified",
              logo: selectedDrive.company_logo || DEFAULT_LOGO // Use logo with fallback
            }}
          />
          <JobDetails details={selectedDrive} studentInfo={null} />
          <div className="flex w-full justify-center mt-4">
            <div className="flex flex-col gap-5 w-full">
              <div className="flex justify-end">
                <div className="flex mr-[3rem] rounded-md px-3 py-1 items-center cursor-pointer">
                  <BsDownload className="text-custom-red" /> {" "}
                  <h3 className="text-custom-red">Download results</h3>
                </div>
              </div>
              <div className="flex gap-20 justify-center">
                <Link to={`/coordinator/edit-drive/${selectedDrive._id}`}>
                  <button className="button-31 pt-4" role="button">
                    Edit Drive
                  </button>
                </Link>
                <button className="button-31 pt-4" role="button">
                  End Drive
                </button>
              </div>
            </div>
          </div>
          <TabSection />
          {currentTab === "experiences" ? (
            <ExperienceSection
              user="coordinator"
              arrayExp={selectedDrive.rounds || []}
            />
          ) : (
            <Results driveId={selectedDrive._id} />
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        <Navbar />
      </div>
      <div className="relative">
        {isMobile ? (
          display === "1" ? (
            <JobList />
          ) : (
            <div className="w-full">
              <button
                className="flex align-middle items-center justify-center gap-1 m-2 h-[1.5rem]"
                onClick={() => setDisplay("1")}
              >
                <IoChevronBackOutline />
                <h1>Back</h1>
              </button>
              <DetailSection />
            </div>
          )
        ) : (
          <div className="flex w-full">
            <JobList />
            <DetailSection />
          </div>
        )}
      </div>
      <style jsx>{`
        .${styles.scrollbarHide}::-webkit-scrollbar {
          display: none;
        }
        .${styles.scrollbarHide} {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default CoordinatorDrive;
