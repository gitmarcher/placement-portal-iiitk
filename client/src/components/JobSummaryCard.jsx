import React from "react";
import Google from "../assets/Google.png";
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import { useState } from "react";
import { MdBookmark } from "react-icons/md";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { toast } from "react-toastify";
// import Toast from "./Toast";


function CompanyBanner({ job }) {
  const [isBookmarkClicked, handleBookmarkClicked] = useState(false);

  // Format of job object
  //  const job = {
  //    logo: Google,
  //    company: "GOOGLE",
  //    type: "Full-Time",
  //    position: "Software Engineer",
  //    location: "Bangalore",
  //    duration: "6 Months",
  //    salary: "1,25,000/month",
  //    deadline: "30/06/2024",
  //    applicants: "140",
  //    ppo: "1,00,000",
  //    deadlineTime: "5 PM IST"
  //  };

  function handleShareClick() {
    // Gets the current window URL
    const currentUrl = window.location.href;
    // Copies the current URL to clipboard
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy URL: ", error);
        toast.error("Failed to copy URL");
      });
  }

  function handleBookmarkClick() {
    try {
      handleBookmarkClicked((prev) => {
        console.log("Bookmark clicked",prev);
        if (prev) {
          toast.error("Removing from bookmarks");
        } else {
          toast.success("Adding to bookmarks");
        }
        return !prev;
      })
    } catch (error) {
      console.error("Failed to toggle bookmark: ", error);
      toast.error("Failed to toggle bookmark");
    }
  }
  return (
    <div className=" w-full font-ubuntu mt-3 ">
      {/* <Toast /> */}

      {/* Handling LOGO,NAME,POSITION,OFFER TYPE */}
      <div className=" right-0 pl-[1.2rem]  border-gray-100 border-2 border-solid p-4   mb-2 sm:rounded-xl sm:mx-12">
        <div className="flex  justify-center h-full float-right top-[10rem] ml-[-4rem]   sm:float-left sm:ml-0">
        <div className="w-12 h-full flex items-center    mb-2 py-4 mx-6 mr-[1.5rem] sm:w-16  ">
          <img src={job.logo} alt={job.company} className="w-full h-auto " />
        </div>
        </div>
        <div className="flex flex-col gap-3 sm:gap-5">
          <div className="flex flex-row sm:flex-row justify-between gap-2 sm:items-center  sm:gap-4">
            <div className="flex flex-col">
              <div className="flex flex-row sm:flex-row sm:items-center gap-4">
                <div className="  sm:2xl  text-3xl font-bold ">
                  {job.company}
                </div>
                <div className="text-red-500 mx-5 px-5 border-red-500 border-2 py-1 my-3 text-xs w-fit">
                  {job.type}
                </div>
              </div>
              <div className="text-gray-500 text-sm sm:text-base">
                {job.position}
              </div>
            </div>
          </div>

          {/* Handling LOCATION,DURATION,SALARY/STIPEND */}
          <div className="font-semibold flex flex-wrap gap-1.5 sm:gap-4">
            <div className="flex items-center text-gray-500 text-base font-normal gap-0.2 sm:gap-1 ">
              <CiLocationOn size={23} />
              {job.location}
            </div>
            <div className="flex items-center font-normal text-gray-500 gap-1 sm:gap-2 text-base">
              <SlCalender size={23} />
              {job.duration}
            </div>
            <div className="flex items-center font-normal text-gray-500 gap-[0.5px] sm:gap-1 text-base">
              <BsCurrencyRupee size={23} />
              {job.salary}
            </div>
          </div>

          {/* Handling DEADLINE,NO OF APPLICANTS,SHARING AND SAVING */}

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-4">
            <div className="text-red-500 font-normal text-base">
              Apply before {job.deadline} {job.deadlineTime}
            </div>
          </div>
          <div className="text-base flex justify-between text-gray-500">
            <div>
              <FaUsers size={23} className="float-left mr-3" />
              {job.applicants} applicants
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