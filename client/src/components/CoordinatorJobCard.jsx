import React from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";

const CoordinatorJobCard = ({ job }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 mx-2 mb-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300">
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-row sm:flex-row justify-between sm:items-center gap-2 sm:gap-4">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex flex-row sm:flex-row sm:items-center gap-3 flex-wrap mb-1">
            <div className="font-bold text-xl sm:text-2xl text-gray-900 leading-tight break-words">
              {job.company}
            </div>
            <div className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 text-xs font-medium rounded-full w-fit flex-shrink-0">
              {job.type}
            </div>
          </div>
          <div className="text-sm sm:text-base text-gray-600 font-medium break-words">
            {job.position}
          </div>
        </div>
        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
          <img
            src={job.logo || job.company_logo || "/default-logo.png"}
            alt={job.company}
            className="w-full h-full object-contain rounded-lg border border-gray-200 bg-gray-50 p-2"
            onError={(e) => {
              e.target.src = "/default-logo.png";
            }}
          />
        </div>
      </div>
      <div className="font-medium flex flex-wrap gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <CiLocationOn className="flex-shrink-0 text-gray-500" />
          <span className="break-words">{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <SlCalender className="flex-shrink-0 text-gray-500" />
          <span className="break-words">{job.duration}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <BsCurrencyRupee className="flex-shrink-0 text-gray-500" />
          <span className="break-words">
            {job.type === "Intern"
              ? job.stipend
              : job.type === "Intern + PPO"
              ? `${job.stipend} (Stipend) / ${job.salary} (CTC)`
              : job.salary}
          </span>
        </div>
      </div>
      <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-3 xs:gap-4 pt-2 border-t border-gray-100">
        <div className="text-red-600 text-sm font-medium flex-shrink-0 order-2 xs:order-1 break-words">
          {job.deadline}
        </div>
        <div className="flex flex-row items-center justify-center xs:justify-end gap-3 xs:gap-3 min-w-0 order-1 xs:order-2">
          <button className="text-gray-500 hover:text-coral-red transition-colors duration-200 p-2 hover:bg-gray-50 rounded-lg flex-shrink-0">
            <CiBookmark className="text-xl sm:text-2xl" />
          </button>
          <button className="text-gray-500 hover:text-coral-red transition-colors duration-200 p-2 hover:bg-gray-50 rounded-lg flex-shrink-0">
            <IoIosNotificationsOutline className="text-xl sm:text-2xl" />
          </button>
          <Link to={`/coordinator/drive/${job.id}`} className="flex-shrink-0">
            <button className="bg-gray-900 text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow whitespace-nowrap">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default CoordinatorJobCard;
