import React from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";

const CoordinatorJobCard = ({ job }) => (
  <div className="border-gray-200 border-3 p-4 rounded-xl mt-2 mx-2 mb-2 shadow-xl border-2">
    <div className="flex flex-col gap-3 sm:gap-5">
      <div className="flex flex-row sm:flex-row justify-between sm:items-center gap-2 sm:gap-4">
        <div className="flex flex-col">
          <div className="flex flex-row sm:flex-row sm:items-center gap-2">
            <div className="font-bold text-xl sm:text-2xl">{job.company}</div>
            <div className="text-red-500 border-red-500 border-2 px-2 py-1 text-xs w-fit">
              {job.type}
            </div>
          </div>
          <div className="text-sm sm:text-base">{job.position}</div>
        </div>
        <div className="w-12 sm:w-16">
          <img src={job.logo} alt={job.company} className="w-full h-auto" />
        </div>
      </div>
      <div className="font-semibold flex flex-wrap gap-2 sm:gap-4">
        <div className="flex items-center gap-1 text-sm">
          <CiLocationOn />
          {job.location}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <SlCalender />
          {job.duration}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <BsCurrencyRupee />
          {job.salary}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-4">
        <div className="text-red-500 text-sm">{job.deadline}</div>
        <div className="flex flex-row items-center justify-end gap-2">
          <CiBookmark className="text-xl sm:text-2xl" />
          <IoIosNotificationsOutline className="text-2xl sm:text-3xl" />
          <Link to={`/coordinator/drive/${job.id}`}>
            <button className="bg-black text-white p-1 px-3 rounded-md text-sm">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default CoordinatorJobCard;
