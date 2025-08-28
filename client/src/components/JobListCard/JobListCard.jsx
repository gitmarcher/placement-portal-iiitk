import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import React from "react";

const JobListCard = ({ job }) => {
  // Handle location as either an array or a single value
  const locationDisplay = Array.isArray(job.location)
    ? job.location.join(", ")
    : job.location || "Not specified";

  return (
    <div className="flex items-start p-3 sm:p-4 w-full gap-3 sm:gap-4 hover:bg-gray-50 transition-colors duration-200">
      {/* Company Logo */}
      <div className="flex-shrink-0">
        <img
          src={job.company_logo || "/default-logo.png"}
          alt={job.company_name || "Company"}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain border border-gray-200 bg-white p-1"
          onError={(e) => {
            e.target.src = "/default-logo.png";
          }}
        />
      </div>

      {/* Job Details */}
      <div className="flex-1 min-w-0">
        {/* Header Section */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-1 xs:gap-2 mb-1">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-700 break-words leading-tight">
            {job.company_name || "Unknown Company"}
          </h2>
          {/* Status indicator */}
          {job.isActive !== undefined && (
            <div
              className={`${
                job.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 w-fit`}
            >
              {job.isActive ? "Active" : "Inactive"}
            </div>
          )}
        </div>

        {/* Position/Drive Name */}
        <p className="text-sm sm:text-base font-semibold text-slate-gray mb-2 break-words leading-tight">
          {job.drive_name || "Unknown Position"}
        </p>

        {/* Job Type and Location/Duration Info */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-end gap-2 xs:gap-4">
          {/* Job Type */}
          <p className="text-xs sm:text-sm font-semibold text-custom-red flex-shrink-0 order-2 xs:order-1">
            {job.type_of_role || "Unknown Type"}
          </p>

          {/* Location and Duration */}
          <div className="flex flex-col xs:flex-row gap-1 xs:gap-3 lg:gap-4 order-1 xs:order-2">
            <div className="flex items-center min-w-0">
              <IoLocationOutline className="text-slate-gray flex-shrink-0 text-sm" />
              <p className="text-xs sm:text-sm font-medium text-slate-gray ml-1 truncate">
                {locationDisplay}
              </p>
            </div>
            <div className="flex items-center min-w-0">
              <IoCalendarOutline className="text-slate-gray flex-shrink-0 text-sm" />
              <p className="text-xs sm:text-sm font-medium text-slate-gray ml-1 truncate">
                {job.duration || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(JobListCard);
