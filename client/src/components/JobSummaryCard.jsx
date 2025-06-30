import React, { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { GoShareAndroid } from "react-icons/go";
import { MdBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { toastService } from "./Toast";

function CompanyBanner({ job }) {
  const [isBookmarkClicked, setIsBookmarkClicked] = useState(false);

  // Handle location as either an array or a single value
  const locationDisplay = Array.isArray(job.location)
    ? job.location.join(", ")
    : job.location || "Not specified";

  function handleShareClick() {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => toastService.success("URL copied to clipboard"))
      .catch((error) => {
        console.error("Failed to copy URL: ", error);
        toastService.error("Failed to copy URL");
      });
  }

  function handleBookmarkClick() {
    try {
      setIsBookmarkClicked((prev) => {
        console.log("Bookmark clicked", prev);
        if (prev) {
          toastService.success("Removed from bookmarks");
        } else {
          toastService.success("Added to bookmarks");
        }
        return !prev;
      });
    } catch (error) {
      console.error("Failed to toggle bookmark: ", error);
      toastService.error("Failed to toggle bookmark");
    }
  }

  return (
    <div className="w-full font-ubuntu mt-3">
      {/* Mobile-optimized responsive banner */}
      <div className="border-gray-200 border-2 rounded-xl mx-4 md:mx-12 p-4 md:p-6 bg-white shadow-sm">
        {/* Header section with logo and company info */}
        <div className="flex items-start gap-4 mb-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              <img
                src={job.company_logo || "/default-logo.png"}
                alt={job.company_name || "Company"}
                className="w-full h-full object-contain rounded-lg p-1"
                onError={(e) => {
                  e.target.src = "/default-logo.png";
                  e.target.onerror = null;
                }}
              />
            </div>
          </div>

          {/* Company info and type badge */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {job.company_name || "Unknown Company"}
                </h1>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  {job.drive_name || "Unknown Position"}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-full">
                  {job.type_of_role || "Unknown Type"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job details section */}
        <div className="space-y-4">
          {/* Key details row */}
          <div className="flex flex-wrap gap-3 md:gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <CiLocationOn size={18} className="flex-shrink-0" />
              <span className="text-sm md:text-base">{locationDisplay}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <SlCalender size={18} className="flex-shrink-0" />
              <span className="text-sm md:text-base">
                {job.duration || "Not specified"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BsCurrencyRupee size={18} className="flex-shrink-0" />
              <span className="text-sm md:text-base">
                {job.type_of_role === "Intern"
                  ? job.stipend || "Not specified"
                  : job.type_of_role === "Intern + PPO"
                  ? `${job.stipend || "N/A"} (Stipend) / ${
                      job.ctc || "N/A"
                    } (CTC)`
                  : job.ctc || "Not specified"}
              </span>
            </div>
          </div>

          {/* Deadline section */}
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <p className="text-red-700 font-medium text-sm md:text-base">
              📅 Apply before{" "}
              {job.deadline
                ? new Date(job.deadline).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })
                : "Not specified"}
            </p>
          </div>

          {/* Bottom section with applicants and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <FaUsers size={18} className="flex-shrink-0" />
              <span className="text-sm md:text-base">
                {job.applied_students?.length || 0} applicant
                {(job.applied_students?.length || 0) !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBookmarkClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title={
                  isBookmarkClicked
                    ? "Remove from bookmarks"
                    : "Add to bookmarks"
                }
              >
                {isBookmarkClicked ? (
                  <MdBookmark size={22} className="text-coral-red" />
                ) : (
                  <MdOutlineBookmarkBorder
                    size={22}
                    className="text-gray-500 hover:text-coral-red"
                  />
                )}
              </button>
              <button
                onClick={handleShareClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Share job posting"
              >
                <GoShareAndroid
                  size={22}
                  className="text-gray-500 hover:text-coral-red"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyBanner;
