import React, { useState } from "react";
import StudentDriveForm from "./StudentDriveForm";

export default function AboutWork({ details, studentInfo }) {
  const [formDisplay, setFormDisplay] = useState(false);

  return (
    <div className="right-0 border-gray-100 border-2 border-solid p-4 sm:rounded-xl mt-2 mb-2 sm:mx-12">
      <div className="right-0 mx-2 mt-2 mb-2 relative sm:mx-12 sm:rounded-xl">
        {formDisplay ? (
          <StudentDriveForm details={studentInfo} />
        ) : (
          <div className="sm:ml-7">
            <h1 className="font-medium text-xl text-custom-red">
              About the Work
            </h1>
            <p
              className="mt-3"
              style={{
                color: "rgba(134, 134, 134, 1)",
                whiteSpace: "pre-wrap"
              }}
            >
              {details.about || "No description available"}
            </p>
            <div style={{ color: "rgba(134, 134, 134, 1)" }}>
              <h3 className="font-medium text-lg mb-5 mt-6 text-custom-red">
                Eligibility
              </h3>
              <div className="ml-4 flex flex-col gap-2">
                <p>CGPA: {details.criteria?.cgpa || "Not specified"}</p>
                <p>
                  Backlogs: 
                  {studentInfo?.academics?.backlogs ?? "Not specified"}
                </p>
                <p>
                  Batch: 
                  {details.criteria?.graduation_year?.join(", ") ||
                    "Not specified"}
                </p>
                <p>
                  Branches: 
                  {details.criteria?.stream?.join(", ") || "Not specified"}
                </p>
              </div>
            </div>
            <div style={{ color: "rgba(134, 134, 134, 1)" }}>
              <h3 className="font-medium text-lg mb-5 mt-6 text-custom-red">
                Salary
              </h3>
              <div className="ml-4 flex flex-col gap-2">
                <p>Duration: {details.duration || "Not specified"}</p>
                <p>CTC: {details.ctc || "Not specified"}</p>
                <p>
                  Location: 
                  {Array.isArray(details.location)
                    ? details.location.join(", ")
                    : details.location || "Not specified"}
                </p>
              </div>
            </div>
            <div style={{ color: "rgba(134, 134, 134, 1)" }}>
              <h3 className="font-medium text-lg mb-5 mt-6 text-custom-red">
                Timeline
              </h3>
              <div className="ml-4 flex flex-col gap-2 mb-3">
                <p>
                  Apply before: 
                  {details.deadline
                    ? new Date(details.deadline).toLocaleString()
                    : "Not specified"}
                </p>
                <p>
                  Start Date: 
                  {details.drive_date
                    ? new Date(details.drive_date).toLocaleString()
                    : "Not specified"}
                </p>
                <p>
                  End Date: 
                  {details.duration && details.drive_date
                    ? new Date(
                        new Date(details.drive_date).getTime() +
                          parseDuration(details.duration)
                      ).toLocaleString()
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to parse duration (assuming format like "6 Months")
function parseDuration(duration) {
  const [amount, unit] = duration?.split(" ") || [];
  const num = parseInt(amount, 10) || 0;
  return unit?.toLowerCase() === "months"
    ? num * 30 * 24 * 60 * 60 * 1000
    : num * 24 * 60 * 60 * 1000; // Default to days if unit not specified
}
