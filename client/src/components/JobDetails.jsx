import React, { useState } from "react";
import StudentDriveForm from "./StudentDriveForm";

export default function AboutWork({ details, studentInfo }) {
  const [formDisplay, setFormDisplay] = useState(false);

  const formatDeadline = (deadline) => {
    if (!deadline) return "Not specified";
    return new Date(deadline).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Helper function to parse duration (assuming format like "6 Months")
  const parseDuration = (duration) => {
    const [amount, unit] = duration?.split(" ") || [];
    const num = parseInt(amount, 10) || 0;
    return unit?.toLowerCase() === "months"
      ? num * 30 * 24 * 60 * 60 * 1000
      : num * 24 * 60 * 60 * 1000; // Default to days if unit not specified
  };

  const renderHTMLContent = (htmlContent) => {
    if (!htmlContent || htmlContent.trim() === "") {
      return <p className="text-gray-500 italic">No description available</p>;
    }

    return (
      <div
        className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  const DetailItem = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span
        className={`text-right ${
          highlight ? "text-red-600 font-semibold" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {formDisplay ? (
        <StudentDriveForm details={studentInfo} />
      ) : (
        <div className="space-y-8">
          {/* About the Work Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                About the Work
              </h2>
            </div>
            <div className="p-6">{renderHTMLContent(details.about)}</div>
          </div>

          {/* Selection Process Section */}
          {details.rounds && details.rounds.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Selection Process
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {details.rounds
                    .sort((a, b) => a.round_number - b.round_number)
                    .map((round, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
                              {round.round_number}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {round.round_name}
                            </h4>
                            {round.description && (
                              <p className="text-gray-600 leading-relaxed">
                                {round.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Eligibility Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Eligibility Criteria
                </h3>
              </div>
              <div className="p-6 space-y-1">
                <DetailItem
                  label="CGPA"
                  value={details.criteria?.cgpa || "Not specified"}
                />
                <DetailItem
                  label="Max Backlogs"
                  value={
                    details.criteria?.max_backlogs !== undefined
                      ? details.criteria.max_backlogs
                      : "Not specified"
                  }
                />
                <DetailItem
                  label="Graduation Year"
                  value={
                    details.criteria?.graduation_year?.join(", ") ||
                    "Not specified"
                  }
                />
                <DetailItem
                  label="Branches"
                  value={
                    details.criteria?.stream?.join(", ") || "Not specified"
                  }
                />
              </div>
            </div>

            {/* Compensation Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Job Details
                </h3>
              </div>
              <div className="p-6 space-y-1">
                <DetailItem
                  label="CTC"
                  value={details.ctc || "Not specified"}
                />
                <DetailItem
                  label="Duration"
                  value={details.duration || "Not specified"}
                />
                <DetailItem
                  label="Location"
                  value={
                    Array.isArray(details.location)
                      ? details.location.join(", ")
                      : details.location || "Not specified"
                  }
                />
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Important Dates
              </h3>
            </div>
            <div className="p-6 space-y-1">
              <DetailItem
                label="Application Deadline"
                value={formatDeadline(details.deadline)}
                highlight={true}
              />
              <DetailItem
                label="Drive Start Date"
                value={formatDate(details.drive_date)}
              />
              {details.duration && details.drive_date && (
                <DetailItem
                  label="Expected End Date"
                  value={formatDate(
                    new Date(
                      new Date(details.drive_date).getTime() +
                        parseDuration(details.duration)
                    )
                  )}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
