import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobListCard from "../components/JobListCard/JobListCard";
import JobSummaryCard from "../components/JobSummaryCard";
import JobDetails from "../components/JobDetails";
import StudentDriveForm from "../components/StudentDriveForm";
import ExperienceSection from "../components/ExperienceSection";
import { IoChevronBackOutline } from "react-icons/io5";
import { data, job, details, studentInfo } from "../../data";
import styles from "./StudentDrive.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDrive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(id ? parseInt(id) : 1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [display, setDisplay] = useState("1");
  const [formDisplay, setFormDisplay] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (id) => {
    setSelectedCard(id);
    navigate(`/drive/${id}`);
    if (isMobile) {
      setDisplay("2");
    }
  };

  const toggleFormDisplay = () => setFormDisplay(!formDisplay);

  return (
    <>
      <ToastContainer />
      <div className="sticky top-0 z-10 bg-white">
        <Navbar />
      </div>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Main content container with fixed height below navbar */}
        <div className="flex w-full h-full overflow-hidden">
          {/* Job List Section */}
          {(!isMobile || display === "1") && (
            <div className={`${isMobile ? 'w-full' : 'w-[35%]'} h-full flex mt-3 flex-col`}>
              
              <div className={`flex-1 overflow-y-auto ${styles.scrollbarHide}`}>
                {data.map((job) => (
                  <div
                    key={job.id}
                    className={`cursor-pointer ${selectedCard === job.id ? "bg-coral-red/20" : "bg-white"}`}
                    onClick={() => handleCardClick(job.id)}
                  >
                    <JobListCard job={job} id={selectedCard} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details Section */}
          {(!isMobile || display === "2") && (
            <div className={`${isMobile ? 'w-full' : 'w-[65%]'} h-full flex flex-col`}>
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
                <JobSummaryCard job={job} />
                
                {formDisplay ? (
                  <StudentDriveForm
                    details={studentInfo}
                    handleFormClick={toggleFormDisplay}
                  />
                ) : (
                  <>
                    <JobDetails details={details} stud_info={studentInfo} />
                    <div className="flex w-full justify-center mt-4">
                      <button className="button-31 pt-4" onClick={toggleFormDisplay}>
                        View application
                      </button>
                    </div>
                  </>
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