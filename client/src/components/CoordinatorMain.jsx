import React, { useState, useEffect } from "react";
import CoordinatorJobCard from "./CoordinatorJobCard";
import { getDrivesC } from "../API/getDrivesC";

const CoordinatorMain = ({ searchTerm }) => {
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
    deadline: drive.deadline
      ? new Date(drive.deadline).toLocaleString()
      : "Not specified",
    logo: drive.company_logo
  }));

  const filteredJobs = jobData.filter(
    (job) =>
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-4 sm:p-6 mx-2 sm:mx-5">Loading drives...</div>;
  }

  return (
    <div className="p-4 sm:p-6 mx-2 sm:mx-5">
      <div className="flex flex-col gap-6 sm:gap-10 max-h-screen overflow-y-scroll scrollbar-hide">
        {filteredJobs.map((job) => (
          <CoordinatorJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default CoordinatorMain;
