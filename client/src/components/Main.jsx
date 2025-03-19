// src/components/Main.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import Google from "../assets/Google.png";
import paloalto from "../assets/paloalto-logo.png";
import IBM from "../assets/Company - Favicon.png";
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BsCurrencyRupee } from "react-icons/bs";
import { CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { fetchDrives } from "../API/getDrives";
import "./Main.css";

const JobCard = ({ job }) => (
  <div className="border-gray-200 border-3 p-4 rounded-xl mt-2 mx-2 mb-2 shadow-xl border-2">
    <div className="flex flex-col gap-3 sm:gap-5">
      <div className="flex flex-row sm:flex-row justify-between sm:items-center gap-2 sm:gap-4">
        <div className="flex flex-col">
          <div className="flex flex-row sm:flex-row sm:items-center gap-2">
            <div className="font-bold text-xl sm:text-2xl">{job.company}</div>
            <div className="text-red-500 border-red-500 border-2 px-2 py-1 text-xs w-fit">
              {job.type}
            </div>
          </div>
          <div className="text-sm sm:text-base">{job.position}</div>
        </div>
        <div className="w-12 sm:w-16">
          <img src={job.logo} alt={job.company} className="w-full h-auto" />
        </div>
      </div>
      {job.type === "Intern + PPO" ? (
        <>
          <div className="flex flex-col gap-2">
            <div className="font-semibold flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span>Intern:</span>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <CiLocationOn />
                  {job.location}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <SlCalender />
                  {job.duration}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <BsCurrencyRupee />
                  {job.salary}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span>PPO:</span>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <CiLocationOn />
                  {job.location}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <BsCurrencyRupee />
                  {job.ppo}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="font-semibold flex flex-wrap gap-2 sm:gap-4">
          <div className="flex items-center gap-1 text-sm">
            <CiLocationOn />
            {job.location}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <SlCalender />
            {job.duration}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <BsCurrencyRupee />
            {job.salary}
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-4">
        <div className="text-red-500 text-sm">{job.deadline}</div>
        <div className="flex flex-row items-center justify-end right-0 gap-2">
          <div className="text-xl sm:text-2xl">
            <CiBookmark />
          </div>
          <div className="text-2xl sm:text-3xl">
            <IoIosNotificationsOutline />
          </div>
          <div>
            <Link to={`/drive/${job.id}`}>
              <button className="bg-black text-white p-1 px-3 rounded-md text-sm">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Main = ({ searchTerm = "" }) => {
  // Default searchTerm to empty string
  const [drives, setDrives] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastDriveElementRef = useCallback(
    (node) => {
      if (loading || initialLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, initialLoading, hasMore]
  );

  useEffect(() => {
    const loadDrives = async () => {
      setLoading(true);
      try {
        const data = await fetchDrives(page);
        setDrives((prevDrives) =>
          page === 1 ? data.drives : [...prevDrives, ...data.drives]
        );
        setHasMore(page < data.totalPages);
      } catch (error) {
        console.error("Error loading drives:", error);
      } finally {
        setLoading(false);
        if (page === 1) setInitialLoading(false);
      }
    };

    loadDrives();
  }, [page]);

  // Apply filter only if searchTerm is non-empty
  const filteredDrives = Array.isArray(drives)
    ? searchTerm.trim() === ""
      ? drives
      : drives.filter(
          (drive) =>
            (drive.company_name || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (drive.type_of_role || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (drive.location &&
              Array.isArray(drive.location) &&
              drive.location.some((loc) =>
                (loc || "").toLowerCase().includes(searchTerm.toLowerCase())
              ))
        )
    : [];

  // Map backend drive data to frontend job format
  const jobData = filteredDrives.map((drive) => ({
    id: drive._id,
    company: drive.company_name || "Unknown Company",
    type: drive.type_of_role || "Unknown",
    position: drive.drive_name || "Unknown Position",
    location: Array.isArray(drive.location)
      ? drive.location.join(", ")
      : "Not specified",
    duration: drive.duration || "Not specified",
    salary: drive.ctc || "Not specified",
    deadline: drive.deadline
      ? new Date(drive.deadline).toLocaleString()
      : "Not specified",
    logo: drive.company_logo
  }));

  if (initialLoading) {
    return <div>Loading drives...</div>;
  }

  return (
    <div className="p-4 sm:p-6 mx-2 sm:mx-5">
      <div className="flex flex-col gap-6 sm:gap-10 max-h-screen overflow-y-scroll scrollbar-hide">
        {jobData.length > 0 ? (
          jobData.map((job, index) => {
            if (jobData.length === index + 1) {
              return (
                <div ref={lastDriveElementRef} key={job.id}>
                  <JobCard job={job} />
                </div>
              );
            }
            return <JobCard key={job.id} job={job} />;
          })
        ) : (
          <div>No drives available</div>
        )}
        {loading && <div>Loading more drives...</div>}
        {!hasMore && jobData.length > 0 && <div>No more drives to load</div>}
      </div>
    </div>
  );
};

export default Main;
