import React, { useState, useEffect } from "react";
import CoordinatorJobCard from "./CoordinatorJobCard";
import { getDrivesC } from "../API/getDrivesC";

const CoordinatorMain = ({ searchTerm, filters = {} }) => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrives = async () => {
      try {
        const data = await getDrivesC(1, 100);
        setDrives(data.drives || []);
      } catch (error) {
        console.error("Error loading drives:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDrives();
  }, []);

  // Apply advanced filtering logic
  const applyFilters = (drives) => {
    return drives.filter((drive) => {
      // Basic search filter (from navbar search)
      const matchesBasicSearch =
        !searchTerm ||
        searchTerm.trim() === "" ||
        (drive.company_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (drive.drive_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (drive.type_of_role || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (drive.location &&
          Array.isArray(drive.location) &&
          drive.location.some((loc) =>
            (loc || "").toLowerCase().includes(searchTerm.toLowerCase())
          ));

      // Role/Company search filter (from filter component)
      const matchesRoleSearch =
        !filters.searchRole ||
        (drive.company_name || "")
          .toLowerCase()
          .includes(filters.searchRole.toLowerCase()) ||
        (drive.drive_name || "")
          .toLowerCase()
          .includes(filters.searchRole.toLowerCase()) ||
        (drive.type_of_role || "")
          .toLowerCase()
          .includes(filters.searchRole.toLowerCase());

      // Status filter (live vs past)
      const matchesStatus =
        !filters.status ||
        filters.status.length === 0 ||
        filters.status.some((status) => {
          if (status === "live") {
            return (
              drive.isActive &&
              drive.acceptingApplications &&
              new Date(drive.deadline) > new Date()
            );
          } else if (status === "past") {
            return (
              !drive.isActive ||
              !drive.acceptingApplications ||
              new Date(drive.deadline) <= new Date()
            );
          }
          return false;
        });

      // Type filter (Intern, Intern + PPO, Fulltime)
      const matchesType =
        !filters.type ||
        filters.type.length === 0 ||
        filters.type.some((type) => {
          const driveType = (drive.type_of_role || "").toLowerCase();
          const filterType = type.toLowerCase();

          if (filterType === "intern") {
            return driveType === "intern";
          } else if (filterType === "fulltime") {
            return driveType === "fulltime";
          } else if (filterType === "intern + ppo") {
            return driveType === "intern + ppo";
          }
          return driveType.includes(filterType);
        });

      // Location filter
      const matchesLocation =
        ((!filters.location || filters.location.length === 0) &&
          !filters.locationSearch) ||
        (filters.location &&
          filters.location.length > 0 &&
          filters.location.some((locType) => {
            const driveLocations = drive.location || [];
            if (locType === "Remote") {
              return driveLocations.some(
                (loc) =>
                  (loc || "").toLowerCase().includes("remote") ||
                  (loc || "").toLowerCase().includes("work from home") ||
                  (loc || "").toLowerCase().includes("wfh")
              );
            } else if (locType === "On-site") {
              return driveLocations.some(
                (loc) =>
                  loc &&
                  !(loc || "").toLowerCase().includes("remote") &&
                  !(loc || "").toLowerCase().includes("work from home") &&
                  !(loc || "").toLowerCase().includes("wfh")
              );
            }
            return false;
          })) ||
        (filters.locationSearch &&
          drive.location &&
          Array.isArray(drive.location) &&
          drive.location.some((loc) =>
            (loc || "")
              .toLowerCase()
              .includes(filters.locationSearch.toLowerCase())
          ));

      // Batch filter (based on graduation year in criteria)
      const matchesBatch =
        !filters.batch ||
        filters.batch.length === 0 ||
        (drive.criteria &&
          drive.criteria.graduation_year &&
          Array.isArray(drive.criteria.graduation_year) &&
          filters.batch.some((batch) =>
            drive.criteria.graduation_year.includes(parseInt(batch))
          )) ||
        // If no specific graduation year criteria, show for all batches
        !drive.criteria ||
        !drive.criteria.graduation_year;

      return (
        matchesBasicSearch &&
        matchesRoleSearch &&
        matchesStatus &&
        matchesType &&
        matchesLocation &&
        matchesBatch
      );
    });
  };

  // Apply filters to drives
  const filteredDrives = applyFilters(drives);

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
    stipend: drive.stipend || "Not specified",
    deadline: drive.deadline
      ? new Date(drive.deadline).toLocaleString()
      : "Not specified",
    logo: drive.company_logo,
    isActive: drive.isActive,
    acceptingApplications: drive.acceptingApplications
  }));

  if (loading) {
    return <div className="p-4 sm:p-6 mx-2 sm:mx-5">Loading drives...</div>;
  }

  // Show filter results count
  const totalDrives = drives.length;
  const filteredCount = filteredDrives.length;
  const hasActiveFilters =
    Object.values(filters).some((filter) =>
      Array.isArray(filter) ? filter.length > 0 : Boolean(filter)
    ) || Boolean(searchTerm && searchTerm.trim());

  return (
    <div className="p-4 sm:p-6 mx-2 sm:mx-5">
      {/* Filter Results Header */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="text-sm text-gray-600">
            Showing <strong>{filteredCount}</strong> of{" "}
            <strong>{totalDrives}</strong> drives
            {filteredCount !== totalDrives && (
              <span className="text-coral-red ml-1">(filtered)</span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 sm:gap-10 max-h-screen overflow-y-scroll scrollbar-hide">
        {jobData.length > 0 ? (
          jobData.map((job) => <CoordinatorJobCard key={job.id} job={job} />)
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
      </div>
    </div>
  );
};

export default CoordinatorMain;
