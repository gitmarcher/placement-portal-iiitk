import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobListCard from "../components/JobListCard/JobListCard";
import JobSummaryCard from "../components/JobSummaryCard";
import JobDetails from "../components/JobDetails";
import ExperienceSection from "../components/ExperienceSection";
import Applicants from "../components/Applicants";
import Results from "../components/Results";
import { IoChevronBackOutline } from "react-icons/io5";
import { BsDownload } from "react-icons/bs";
import getDrivesC from "../API/getDrivesC";

import { StudentCredContext } from "../contexts/StudentCredContext";
import { toastService } from "../components/Toast";
import api from "../API/index";

const CoordinatorDrive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(id);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentTab, setCurrentTab] = useState("experiences");
  const [display, setDisplay] = useState("1");
  const [drives, setDrives] = useState([]); // Added this line to fix the error
  const [loading, setLoading] = useState(true); // Added this line to fix the error
  const [experiences, setExperiences] = useState([]);
  const [toggleLoading, setToggleLoading] = useState(false);
  const { studentCreds } = useContext(StudentCredContext);

  // Default logo constant for fallback
  const DEFAULT_LOGO = "https://via.placeholder.com/100";

  // Fetch drives data
  useEffect(() => {
    const loadDrives = async () => {
      try {
        const data = await getDrivesC(1, 100);
        setDrives(data.drives || []);

        // If we have an ID from the URL, make sure it's selected
        if (id) {
          setSelectedCard(id);
        }
      } catch (error) {
        console.error("Error fetching drives:", error);
        toastService.error("Failed to load drives data");
      } finally {
        setLoading(false);
      }
    };
    loadDrives();
  }, [id]);

  // Fetch experiences when a drive is selected
  useEffect(() => {
    const fetchExperiences = async () => {
      if (!selectedCard) return;

      try {
        const response = await api.get(
          `/coordinator/drive/experiences/${selectedCard}`
        );
        setExperiences(response.data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        // Don't show error toast here, as the drive might not have any experiences yet
      }
    };

    fetchExperiences();
  }, [selectedCard]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (driveId) => {
    setSelectedCard(driveId);
    navigate(`/coordinator/drive/${driveId}`);
    if (isMobile) {
      setDisplay("2");
    }
  };

  const handleTabClick = (event) => setCurrentTab(event.currentTarget.id);

  const handleDownloadApplicants = async () => {
    try {
      const response = await api.get(
        `/coordinator/drive/download-applicants/${selectedCard}`,
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const selectedDrive = drives.find((drive) => drive._id === selectedCard);
      const fileName = `${
        selectedDrive?.company_name || "Drive"
      }_Applicants.xlsx`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toastService.success("Applicants list downloaded successfully!");
    } catch (error) {
      console.error("Error downloading applicants:", error);
      toastService.error("Failed to download applicants list");
    }
  };

  // Toggle drive status (end applications, end drive, or reactivate)
  const handleDriveAction = async (action) => {
    if (!selectedCard) return;

    try {
      setToggleLoading(true);

      const response = await api.put(
        `/coordinator/drive/toggle-active/${selectedCard}`,
        {
          action: action
        }
      );

      // Update the drive in the local state
      setDrives((prevDrives) =>
        prevDrives.map((drive) =>
          drive._id === selectedCard
            ? {
                ...drive,
                isActive: response.data.isActive,
                acceptingApplications: response.data.acceptingApplications
              }
            : drive
        )
      );

      toastService.success(response.data.message);
    } catch (error) {
      console.error("Error updating drive status:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update drive status";
      toastService.error(errorMsg);
    } finally {
      setToggleLoading(false);
    }
  };

  // Get the appropriate button text and action based on drive state
  const getDriveActionButton = (drive) => {
    if (!drive.isActive) {
      // Drive is completely ended
      return {
        text: "Reactivate Drive",
        action: "reactivate",
        className: "bg-green-600 hover:bg-green-700"
      };
    } else if (drive.acceptingApplications) {
      // Drive is active and accepting applications
      return {
        text: "End Applications",
        action: "end-applications",
        className: "bg-orange-600 hover:bg-orange-700"
      };
    } else {
      // Applications ended but drive still active
      return {
        text: "End Drive",
        action: "end-drive",
        className: "bg-gray-600 hover:bg-gray-700"
      };
    }
  };

  const selectedDrive =
    drives.find((drive) => drive._id === selectedCard) || {};

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
                {loading ? (
                  <div className="flex justify-center items-center h-full p-4">
                    <div className="text-base sm:text-xl font-semibold text-gray-700 flex flex-col items-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-coral-red border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-center">Loading drives...</span>
                    </div>
                  </div>
                ) : drives.length === 0 ? (
                  <div className="flex justify-center items-center h-full p-4">
                    <div className="text-center p-4 sm:p-8">
                      <div className="text-gray-400 text-4xl sm:text-6xl mb-4">
                        📋
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-700">
                        No Drives Available
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 mt-2">
                        There are currently no drives in the system
                      </p>
                    </div>
                  </div>
                ) : (
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
                )}
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
                      navigate("/coordinator/dashboard");
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
                    <JobSummaryCard job={selectedDrive} />
                    <JobDetails details={selectedDrive} studentInfo={null} />

                    {/* Tab Section for Experiences, Applicants, and Results */}
                    <div className="mx-2 sm:mx-4 border-gray-100 p-2 sm:p-4 rounded-xl mt-2 mb-2">
                      <div className="flex align-middle overflow-x-auto scrollbar-hide">
                        {["experiences", "applicants", "results"].map((tab) => (
                          <div
                            key={tab}
                            id={tab}
                            className={`flex justify-center border-2 mx-0 ${
                              currentTab === tab
                                ? "text-coral-red border-b-coral-red"
                                : ""
                            } cursor-pointer border-x-transparent border-t-transparent px-3 sm:px-5 py-2 sm:py-3 flex-shrink-0 min-w-fit`}
                            onClick={handleTabClick}
                          >
                            <h1 className="font-medium text-sm sm:text-lg whitespace-nowrap">
                              {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </h1>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="px-2 sm:px-4">
                      {currentTab === "experiences" ? (
                        <ExperienceSection
                          driveId={selectedDrive._id}
                          experiences={experiences}
                          setExperiences={setExperiences}
                        />
                      ) : currentTab === "applicants" ? (
                        <Applicants driveId={selectedDrive._id} />
                      ) : (
                        <Results
                          driveId={selectedDrive._id}
                          driveData={selectedDrive}
                        />
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-4 mb-8 px-2 sm:px-4">
                      <button
                        className="w-full sm:w-auto px-6 py-3 bg-coral-red text-white rounded-lg font-medium shadow-sm hover:bg-coral-red/90 transition-all duration-200 order-1"
                        onClick={() =>
                          navigate(
                            `/coordinator/edit-drive/${selectedDrive._id}`
                          )
                        }
                      >
                        Edit Drive
                      </button>
                      <button
                        className={`w-full sm:w-auto px-6 py-3 ${
                          getDriveActionButton(selectedDrive).className
                        } text-white rounded-lg font-medium shadow-sm transition-all duration-200 ${
                          toggleLoading ? "opacity-50 cursor-not-allowed" : ""
                        } order-2`}
                        onClick={() =>
                          handleDriveAction(
                            getDriveActionButton(selectedDrive).action
                          )
                        }
                        disabled={toggleLoading}
                      >
                        {toggleLoading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          getDriveActionButton(selectedDrive).text
                        )}
                      </button>
                      <div
                        className="w-full sm:w-auto flex rounded-md px-3 py-2 items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-200 border border-gray-200 order-3"
                        onClick={handleDownloadApplicants}
                      >
                        <BsDownload className="text-coral-red mr-2 flex-shrink-0" />
                        <h3 className="text-coral-red text-center whitespace-nowrap">
                          Download Applicants List
                        </h3>
                      </div>
                    </div>
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

export default CoordinatorDrive;
