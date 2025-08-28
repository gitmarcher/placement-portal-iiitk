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
  <div className="bg-white border border-gray-200 rounded-2xl p-5 mx-2 mb-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300">
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-row sm:flex-row justify-between sm:items-center gap-2 sm:gap-4">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex flex-row sm:flex-row sm:items-center gap-3 mb-1">
            <div className="font-bold text-xl sm:text-2xl text-gray-900 leading-tight">
              {job.company}
            </div>
            <div className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 text-xs font-medium rounded-full w-fit">
              {job.type}
            </div>
          </div>
          <div className="text-sm sm:text-base text-gray-600 font-medium">
            {job.position}
          </div>
        </div>
        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
          <img
            src={job.logo}
            alt={job.company}
            className="w-full h-full object-contain rounded-lg border border-gray-200 bg-gray-50 p-2"
            onError={(e) => {
              e.target.src = "/default-logo.png";
            }}
          />
        </div>
      </div>
      {job.type === "Intern + PPO" ? (
        <>
          <div className="flex flex-col gap-2">
            <div className="font-semibold flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="text-gray-700 text-sm">Intern:</span>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <CiLocationOn className="text-gray-500" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <SlCalender className="text-gray-500" />
                  {job.duration}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <BsCurrencyRupee className="text-gray-500" />
                  {job.stipend}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="text-gray-700 text-sm">PPO:</span>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <CiLocationOn className="text-gray-500" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <BsCurrencyRupee className="text-gray-500" />
                  {job.stipend}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="font-medium flex flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <CiLocationOn className="text-gray-500" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <SlCalender className="text-gray-500" />
            {job.duration}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <BsCurrencyRupee className="text-gray-500" />
            {job.type === "Intern" ? job.stipend : job.salary}
          </div>
        </div>
      )}
      <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-3 xs:gap-4 pt-2 border-t border-gray-100">
        <div className="text-red-600 text-sm font-medium flex-shrink-0 order-2 xs:order-1">
          {job.deadline}
        </div>
        <div className="flex flex-row items-center justify-center xs:justify-end gap-3 xs:gap-3 min-w-0 order-1 xs:order-2">
          <button className="text-gray-500 hover:text-coral-red transition-colors duration-200 p-2 hover:bg-gray-50 rounded-lg flex-shrink-0">
            <CiBookmark className="text-xl sm:text-2xl" />
          </button>
          <button className="text-gray-500 hover:text-coral-red transition-colors duration-200 p-2 hover:bg-gray-50 rounded-lg flex-shrink-0">
            <IoIosNotificationsOutline className="text-xl sm:text-2xl" />
          </button>
          <Link to={`/drive/${job.id}`} className="flex-shrink-0">
            <button className="bg-gray-900 text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow whitespace-nowrap">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const Main = ({ searchTerm = "", filters = {} }) => {
  const [drives, setDrives] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [totalDrives, setTotalDrives] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  const observer = useRef();

  const lastDriveElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    // When filters or search term change, reset page to 1 and clear drives
    setPage(1);
    setDrives([]);
  }, [searchTerm, filters]);

  useEffect(() => {
    const loadDrives = async () => {
      setLoading(true);
      try {
        const data = await fetchDrives(page, 10, filters, searchTerm);
        setDrives((prevDrives) =>
          page === 1 ? data.drives : [...prevDrives, ...data.drives]
        );
        setHasMore(page < data.totalPages);
        setTotalDrives(data.totalDrives);
        setFilteredCount(data.totalDrives);
      } catch (error) {
        console.error("Error loading drives:", error);
      } finally {
        setLoading(false);
        if (page === 1) setInitialLoading(false);
      }
    };

    loadDrives();
  }, [page, searchTerm, filters]);

  const jobData = drives.map((drive) => ({
    id: drive._id,
    company: drive.company_name || "Unknown Company",
    type: drive.type_of_role || "Unknown",
    position: drive.drive_name || "Unknown Position",
    location: Array.isArray(drive.location)
      ? drive.location.join(", ")
      : "Not specified",
    duration: drive.duration || "Not specified",
    salary: drive.ctc || "Not specified",
    stipend: drive.stipend || "Not specified",
    deadline: drive.deadline
      ? new Date(drive.deadline).toLocaleString()
      : "Not specified",
    logo: drive.company_logo,
    isActive: drive.isActive,
    acceptingApplications: drive.acceptingApplications
  }));

  if (initialLoading) {
    return <div>Loading drives...</div>;
  }

  const hasActiveFilters =
    Object.values(filters).some((filter) =>
      Array.isArray(filter) ? filter.length > 0 : Boolean(filter)
    ) || Boolean(searchTerm.trim());

  return (
    <div className="p-4 sm:p-6 mx-2 sm:mx-5">
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="text-sm text-gray-600">
            Showing <strong>{filteredCount}</strong> drives
            {hasActiveFilters && (
              <span className="text-coral-red ml-1">(filtered)</span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 sm:gap-10 max-h-screen overflow-y-scroll scrollbar-hide">
        {jobData.length > 0 ? (
          jobData.map((job, index) => {
            if (jobData.length === index + 1) {
              return (
                <div ref={lastDriveElementRef} key={job.id}>
                  <JobCard job={job} />
                </div>
              );
            } else {
              return <JobCard key={job.id} job={job} />;
            }
          })
        ) : hasActiveFilters ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No drives found
            </h3>
            <p className="text-gray-500 mb-4">
              No drives match your current filter criteria.
            </p>
            <p className="text-sm text-gray-400">
              Try adjusting your filters or search terms to see more results.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No drives available
            </h3>
            <p className="text-gray-500">
              There are currently no placement drives available.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="text-gray-600">Loading more drives...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
