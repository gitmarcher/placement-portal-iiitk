import React, { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { GoShareAndroid } from "react-icons/go";
import { MdBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { toast } from "react-toastify";

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
      .then(() => toast.success("URL copied to clipboard!"))
      .catch((error) => {
        console.error("Failed to copy URL: ", error);
        toast.error("Failed to copy URL");
      });
  }

  function handleBookmarkClick() {
    try {
      setIsBookmarkClicked((prev) => {
        console.log("Bookmark clicked", prev);
        if (prev) {
          toast.error("Removing from bookmarks");
        } else {
          toast.success("Adding to bookmarks");
        }
        return !prev;
      });
    } catch (error) {
      console.error("Failed to toggle bookmark: ", error);
      toast.error("Failed to toggle bookmark");
    }
  }

  return (
    <div className="w-full font-ubuntu mt-3">
      <div className="right-0 pl-[1.2rem] border-gray-100 border-2 border-solid p-4 mb-2 sm:rounded-xl sm:mx-12">
        <div className="flex justify-center h-full float-right top-[10rem] ml-[-4rem] sm:float-left sm:ml-0">
          <div className="w-12 h-full flex items-center mb-2 py-4 mx-6 mr-[1.5rem] sm:w-16">
            <img
              src={job.company_logo || "/default-logo.png"}
              alt={job.company_name || "Company"}
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:gap-5">
          <div className="flex flex-row sm:flex-row justify-between gap-2 sm:items-center sm:gap-4">
            <div className="flex flex-col">
              <div className="flex flex-row sm:flex-row sm:items-center gap-4">
                <div className="sm:2xl text-3xl font-bold">
                  {job.company_name || "Unknown Company"}
                </div>
                <div className="text-red-500 mx-5 px-5 border-red-500 border-2 py-1 my-3 text-xs w-fit">
                  {job.type_of_role || "Unknown Type"}
                </div>
              </div>
              <div className="text-gray-500 text-sm sm:text-base">
                {job.drive_name || "Unknown Position"}
              </div>
            </div>
          </div>

          <div className="font-semibold flex flex-wrap gap-1.5 sm:gap-4">
            <div className="flex items-center text-gray-500 text-base font-normal gap-0.2 sm:gap-1">
              <CiLocationOn size={23} />
              {locationDisplay}
            </div>
            <div className="flex items-center font-normal text-gray-500 gap-1 sm:gap-2 text-base">
              <SlCalender size={23} />
              {job.duration || "Not specified"}
            </div>
            <div className="flex items-center font-normal text-gray-500 gap-[0.5px] sm:gap-1 text-base">
              <BsCurrencyRupee size={23} />
              {job.ctc || "Not specified"}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-4">
            <div className="text-red-500 font-normal text-base">
              Apply before{" "}
              {job.deadline
                ? new Date(job.deadline).toLocaleString()
                : "Not specified"}
            </div>
          </div>
          <div className="text-base flex justify-between text-gray-500">
            <div>
              <FaUsers size={23} className="float-left mr-3" />
              {job.applied_students?.length || 0} applicants
            </div>
            <div className="flex items-center gap-4 mr-6">
              {isBookmarkClicked ? (
                <MdBookmark size={25} onClick={handleBookmarkClick} />
              ) : (
                <MdOutlineBookmarkBorder
                  size={25}
                  onClick={handleBookmarkClick}
                />
              )}
              <GoShareAndroid
                size={25}
                onClick={handleShareClick}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyBanner;
