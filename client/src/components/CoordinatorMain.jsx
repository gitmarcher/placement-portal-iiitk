// src/components/CoordinatorMain.js
import React from "react";
import CoordinatorJobCard from "./CoordinatorJobCard";
import Google from "../assets/Google.png"; // Adjust path as needed

const CoordinatorMain = ({ searchTerm }) => {
  // Dummy data for coordinator-managed drives
  const jobs = [
    {
      id: 1,
      company: "GOOGLE",
      type: "Internship",
      position: "Software Engineer",
      location: "Bangalore",
      duration: "6 Months",
      salary: "1,25,000/month",
      deadline: "Apply Before 30/06/2024 5PM IST",
      logo: Google
    },
    {
      id: 2,
      company: "IBM",
      type: "PPO",
      position: "Software Engineer",
      location: "Kochi",
      duration: "Permanent",
      salary: "60 LPA",
      deadline: "Apply Before 30/06/2024 5PM IST",
      logo: Google // Replace with actual logo
    }
    // Add more as needed
  ];

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 mx-2 sm:mx-5">
      <div className="flex flex-col gap-6 sm:gap-10 max-h-screen overflow-y-scroll scrollbar-hide">
        {filteredJobs.map((job) => (
          <CoordinatorJobCard
            key={job.id}
            job={job}
            basePath="/coordinator/drive"
            buttonText="Manage Drive"
          />
        ))}
      </div>
    </div>
  );
};

export default CoordinatorMain;
