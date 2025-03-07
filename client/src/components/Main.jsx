import React from 'react';
import Google from '../assets/Google.png';
import { Link } from 'react-router-dom';
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BsCurrencyRupee } from "react-icons/bs";
import { CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import paloalto from "../assets/paloalto-logo.png";
import IBM from "../assets/Company - Favicon.png";
import "./Main.css";

const JobCard = ({ job }) => (
  <div className="border-gray-200 border-3  p-4 rounded-xl mt-2 mx-2 mb-2 shadow-xl border-2">
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
      {job.type === "Intern + PPO" ? (
        <>
          <div className="flex flex-col gap-2">
            <div className="font-semibold flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span>Intern:</span>
              <div className="flex flex-wrap gap-2 sm:gap-4">
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
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span>PPO:</span>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <CiLocationOn />
                  {job.location}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <BsCurrencyRupee />
                  {job.ppo}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
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
      )}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-4">
        <div className="text-red-500 text-sm">{job.deadline}</div>
        <div className="flex flex-row items-center justify-end right-0 gap-2">
          <div className="text-xl sm:text-2xl">
            <CiBookmark />
          </div>
          <div className="text-2xl sm:text-3xl">
            <IoIosNotificationsOutline />
          </div>
          <div>
            <Link to = "/drive/1" >
            <button className='bg-black text-white p-1 px-3 rounded-md text-sm'>View Details</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Main = ({ searchTerm }) => {
  const jobs = [
    {
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
      company: "IBM",
      type: "Intern + PPO",
      position: "Software Engineer",
      location: "Kochi",
      duration: "6 Months",
      salary: "25,000/month",
      ppo: "9 LPA",
      deadline: "Apply Before 30/06/2024 5PM IST",
      logo: IBM
    },
    {
      company: "Palo Alto",
      type: "PPO",
      position: "Software Engineer",
      location: "Bangalore",
      duration: "6 Months",
      salary: "60 LPA",
      deadline: "Apply Before 30/06/2024 5PM IST",
      logo: paloalto
    },
    {
      company: "Random",
      type: "Internship",
      position: "Software Engineer",
      location: "Hyderabad",
      duration: "6 Months",
      salary: "1,25,000/month",
      deadline: "Apply Before 30/06/2024 5PM IST",
      logo: IBM
    },
    {
      company: "GOOGLE",
      type: "Intern + PPO",
      position: "Software Engineer",
      location: "Bangalore",
      duration: "6 Months",
      salary: "1,25,000/month",
      ppo: "90 LPA",
      deadline: "Apply Before 30/06/2024 5PM IST",
      logo: Google
    },
    {
      company: "IBM",
      type: "PPO",
      position: "Software Engineer",
      location: "Kochi",
      duration: "6 Months",
      salary: "60 LPA",
      deadline: "Apply Before 30/06/2024 5PM IST",
      logo: IBM
    },
    {
      company: "Palo Alto",
      type: "Internship",
      position: "Software Engineer",
      location: "Bangalore",
      duration: "6 Months",
      salary: "1,25,000/month",
      deadline: "Apply Before 30/06/2024 5PM IST",
      logo: paloalto
    }
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
        {filteredJobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Main;
