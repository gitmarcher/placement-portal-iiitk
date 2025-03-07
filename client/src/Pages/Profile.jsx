import React, { useState } from 'react';
import { ArrowLeft, Edit } from 'lucide-react';
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import ProfileHelperComponent from '../components/ProfileHelperComponent';
import Navbar from '../components/Navbar';

//sample object
const userData = {
  // For Basic Details tab
  basicDetails: {
    Name: '', 
    'Roll number': 'BTech/10001/19', 
    'College email': 'rahul.sharma@college.edu', 
    Program: 'BTech', 
    Branch: 'Computer Science', 
    Batch: '2023', 
    'Personal email': 'rahulsharma@gmail.com', 
    Phone: '+91 9876543210', 
    Gender: 'Male', 
    'Date of birth': '15-05-2001', 
    Address: '123 College Road, Tech Campus', 
    City: 'Bangalore'
  },
  
  // For Educational Details tab
  educationalDetails: {
    'Roll number': 'BTech/10001/19', 
    Course: 'Computer Science and Engineering', 
    CGPA: '8.7', 
    'Graduation year': '2023', 
    Backlogs: '0', 
    '10th': { 
      Degree: '10th', 
      CGPA: '9.5', 
      Institute: 'Delhi Public School', 
      'Passing year': '2017', 
      Board: 'CBSE' 
    }, 
    '12th': { 
      Degree: '12th', 
      CGPA: '9.2', 
      Institute: 'Delhi Public School', 
      'Passing year': '2019', 
      Board: 'CBSE' 
    }, 
    'Btech': { 
      Degree: 'Btech', 
      CGPA: '8.7', 
      Institute: 'National Institute of Technology', 
      'Passing year': '2023', 
      Board: 'University' 
    }, 
    'PG': { 
      Degree: 'PG', 
      CGPA: '', 
      Institute: '', 
      'Passing year': '', 
      Board: '' 
    }
  },
  
  // For Additional Details tab
  additionalDetails: {
    skills: [
      'JavaScript', 
      'React.js', 
      'Node.js', 
      'Python', 
      'Machine Learning', 
      'Data Structures', 
      'Algorithms'
    ],
    workExperience: [
      'Summer Intern at TechSolutions Inc. (May 2022 - July 2022)',
      'Research Assistant at AI Lab (Aug 2022 - Dec 2022)',
      'Backend Developer Intern at StartupX (Jan 2023 - Apr 2023)'
    ],
    resume: 'https://example.com/resume/rahul-sharma.pdf',
    linkedinUrl: 'https://linkedin.com/in/rahul-sharma-dev',
    githubUrl: 'https://github.com/rahul-sharma-dev',
    offersInHand: [
      'Software Engineer at TechCorp (₹18 LPA)',
      'Product Developer at InnovateX (₹16 LPA)'
    ],
    drivesApplied: [
      'Google - SDE Role (Applied on 15 Feb 2023)',
      'Microsoft - Associate Developer (Applied on 20 Feb 2023)',
      'Amazon - SDE 1 (Applied on 5 Mar 2023)'
    ]
  },
  
  // For History tab
  historyDetails: [
    {
      companyName: 'Microsoft',
      type: 'Placement',
      status: 'Offered'
    },
    {
      companyName: 'Google',
      type: 'Internship',
      status: 'Applied'
    },
    {
      companyName: 'Amazon',
      type: 'Placement',
      status: 'Interview Scheduled'
    },
    {
      companyName: 'TechCorp',
      type: 'Placement',
      status: 'Offered'
    },
    {
      companyName: 'Facebook',
      type: 'Placement',
      status: 'Rejected'
    }
  ]
};
const Profile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      <div className="flex-grow">
        <ProfileHelperComponent userData={userData} />
      </div>
    </div>
  )
};

export default Profile;