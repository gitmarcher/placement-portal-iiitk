import React, { useState } from 'react';
import { ArrowLeft, Edit, User, Mail, Phone, MapPin, Calendar, BookOpen, Award, School } from 'lucide-react';
import { FaLinkedin, FaGithub } from "react-icons/fa6";

const ProfileHelperComponent = ({ userData }) => {
  const [activeTab, setActiveTab] = useState("Basic Details");
  
  // Initialize states with userData passed as prop
  const [basicDetails, setBasicDetails] = useState(userData?.basicDetails || {
    Name: '', 
    'Roll number': '', 
    'College email': '', 
    Program: '', 
    Branch: '', 
    Batch: '', 
    'Personal email': '', 
    Phone: '', 
    Gender: '', 
    'Date of birth': '', 
    Address: '', 
    City: ''
  });
  
  const [educationalDetails, setEducationalDetails] = useState(userData?.educationalDetails || {
    'Roll number': '', 
    Course: '', 
    CGPA: '', 
    'Graduation year': '', 
    Backlogs: '', 
    '10th': { 
      Degree: '10th', 
      CGPA: '', 
      Institute: '', 
      'Passing year': '', 
      Board: '' 
    }, 
    '12th': { 
      Degree: '12th', 
      CGPA: '', 
      Institute: '', 
      'Passing year': '', 
      Board: '' 
    }, 
    'Btech': { 
      Degree: 'Btech', 
      CGPA: '', 
      Institute: '', 
      'Passing year': '', 
      Board: '' 
    }, 
    'PG': { 
      Degree: 'PG', 
      CGPA: '', 
      Institute: '', 
      'Passing year': '', 
      Board: '' 
    }
  });
  
  // Add additional details state for the third tab
  const [additionalDetails, setAdditionalDetails] = useState(userData?.additionalDetails || {
    skills: [],
    workExperience: [],
    resume: '',
    linkedinUrl: '',
    githubUrl: '',
    offersInHand: [],
    drivesApplied: []
  });
  
  // Add history state for the fourth tab
  const [historyDetails, setHistoryDetails] = useState(userData?.historyDetails || []);
  
  const [editing, setEditing] = useState(false);

  const handleChange = (section, key, value) => {
    if (section === "Basic Details") {
      setBasicDetails((prev) => ({ ...prev, [key]: value }));
    } else if (section === "Educational Details") {
      setEducationalDetails((prev) => ({ ...prev, [key]: value }));
    } else if (section === "Additional Details") {
      setAdditionalDetails((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleEdit = () => {
    setEditing(!editing);
  };

  const tabs = ["Basic Details", "Educational Details", "Additional Details", "History"];

  // Function to render educational details with proper nesting
  const renderEducationalDetails = () => {
    const mainFields = ["Roll number", "Course", "CGPA", "Graduation year", "Backlogs"];
    const educationHistoryKeys = ["10th", "12th", "Btech", "PG"];
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {mainFields.map(key => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">{key}:</label>
              <input
                type="text"
                className="border p-2 rounded-md w-full bg-white shadow-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={educationalDetails[key] || ""}
                onChange={(e) => handleChange("Educational Details", key, e.target.value)}
                disabled={!editing}
              />
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-gray-800 mb-4 mt-6">Education History</h3>
        <div className="space-y-6">
          {educationHistoryKeys.map(degree => {
            const degreeData = educationalDetails[degree] || {};
            const hasData = degreeData.Institute && degreeData.Institute.trim() !== "";
            
            if (!hasData && !editing) return null;
            
            return (
              <div key={degree} className="p-4 border rounded-md bg-white shadow-sm">
                <div className="flex items-center mb-3">
                  <School className="w-5 h-5 text-red-500 mr-2" />
                  <h4 className="font-medium text-gray-800">{degree}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(degreeData).map(([field, value]) => (
                    <div key={field} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">{field}:</label>
                      <input
                        type="text"
                        className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        value={value || ""}
                        onChange={(e) => {
                          const newEduDetails = {...educationalDetails};
                          newEduDetails[degree][field] = e.target.value;
                          setEducationalDetails(newEduDetails);
                        }}
                        disabled={!editing}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  
  // Function to render additional details
  const renderAdditionalDetails = () => {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <a 
              href={additionalDetails.linkedinUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaLinkedin className="h-6 w-6" />
            </a>
            <a 
              href={additionalDetails.githubUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900"
            >
              <FaGithub className="h-6 w-6" />
            </a>
          </div>
          <a 
            href={additionalDetails.resume || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <span>Resume</span>
            <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180" />
          </a>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Offers in hand</h3>
            {editing && (
              <button className="text-sm text-red-500">+ Add</button>
            )}
          </div>
          {additionalDetails.offersInHand && additionalDetails.offersInHand.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {additionalDetails.offersInHand.map((offer, index) => (
                <li key={index}>
                  {editing ? (
                    <input
                      type="text"
                      className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      value={offer}
                      onChange={(e) => {
                        const newOffers = [...additionalDetails.offersInHand];
                        newOffers[index] = e.target.value;
                        setAdditionalDetails(prev => ({
                          ...prev,
                          offersInHand: newOffers
                        }));
                      }}
                    />
                  ) : (
                    <span>{offer}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">No offers listed</p>
          )}
          
          <div className="flex justify-between mt-4 mb-2">
            <h3 className="font-semibold text-gray-800">Drives applied</h3>
            {editing && (
              <button className="text-sm text-red-500">+ Add</button>
            )}
          </div>
          {additionalDetails.drivesApplied && additionalDetails.drivesApplied.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {additionalDetails.drivesApplied.map((drive, index) => (
                <li key={index}>
                  {editing ? (
                    <input
                      type="text"
                      className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      value={drive}
                      onChange={(e) => {
                        const newDrives = [...additionalDetails.drivesApplied];
                        newDrives[index] = e.target.value;
                        setAdditionalDetails(prev => ({
                          ...prev,
                          drivesApplied: newDrives
                        }));
                      }}
                    />
                  ) : (
                    <span>{drive}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">No drives listed</p>
          )}
        </div>
      
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Skills</h3>
            {editing && (
              <button className="text-sm text-red-500">+ Add Skill</button>
            )}
          </div>
          <div className="bg-gray-50 p-6 rounded-md border">
            <ul className="list-disc pl-5 space-y-2">
              {additionalDetails.skills && additionalDetails.skills.length > 0 ? (
                additionalDetails.skills.map((skill, index) => (
                  <li key={index} className="text-gray-800">
                    {editing ? (
                      <input
                        type="text"
                        className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...additionalDetails.skills];
                          newSkills[index] = e.target.value;
                          setAdditionalDetails(prev => ({
                            ...prev,
                            skills: newSkills
                          }));
                        }}
                      />
                    ) : (
                      <span>{skill}</span>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No skills listed</p>
              )}
            </ul>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Work experience</h3>
            {editing && (
              <button className="text-sm text-red-500">+ Add Experience</button>
            )}
          </div>
          <div className="bg-gray-50 p-6 rounded-md border">
            <ul className="list-disc pl-5 space-y-2">
              {additionalDetails.workExperience && additionalDetails.workExperience.length > 0 ? (
                additionalDetails.workExperience.map((exp, index) => (
                  <li key={index} className="text-gray-800">
                    {editing ? (
                      <input
                        type="text"
                        className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        value={exp}
                        onChange={(e) => {
                          const newExperiences = [...additionalDetails.workExperience];
                          newExperiences[index] = e.target.value;
                          setAdditionalDetails(prev => ({
                            ...prev,
                            workExperience: newExperiences
                          }));
                        }}
                      />
                    ) : (
                      <span>{exp}</span>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No work experience listed</p>
              )}
            </ul>
          </div>
        </div>
        
        {editing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">LinkedIn URL:</label>
              <input
                type="text"
                className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={additionalDetails.linkedinUrl || ""}
                onChange={(e) => handleChange("Additional Details", "linkedinUrl", e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">GitHub URL:</label>
              <input
                type="text"
                className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={additionalDetails.githubUrl || ""}
                onChange={(e) => handleChange("Additional Details", "githubUrl", e.target.value)}
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">Resume URL:</label>
              <input
                type="text"
                className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={additionalDetails.resume || ""}
                onChange={(e) => handleChange("Additional Details", "resume", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Function to render history tab
  const renderHistory = () => {
    return (
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600 text-sm">
                <th className="p-3 font-medium">#</th>
                <th className="p-3 font-medium">Company name</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Status</th>
                
              </tr>
            </thead>
            <tbody className="divide-y">
              {historyDetails && historyDetails.length > 0 ? (
                historyDetails.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.companyName || "Company name"}</td>
                    <td className="p-3">{item.type || "Placement"}</td>
                    <td className="p-3">{item.status || "Status"}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">No history available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with profile photo and tabs */}
        <div className="bg-neutral-200 p-6 pb-16 relative">
          <div className="flex justify-between items-center mb-4">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleEdit}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                editing 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-white hover:bg-gray-100 text-red-500"
              }`}
            >
              <Edit className="h-4 w-4 mr-2" />
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
          
        </div>

        {/* Profile photo */}
        <div className="flex justify-center -mt-12 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-red-300 flex items-center justify-center text-white font-semibold text-sm border-4 border-white shadow-md relative overflow-hidden">
              {basicDetails.Name ? (
                <span className="text-xl font-bold">
                  {basicDetails.Name.split(' ').map(n => n[0]).join('')}
                </span>
              ) : (
                "No photo."
              )}
             
            </div>
          </div>
        </div>

        {basicDetails.Name && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{basicDetails.Name}</h2>
            <p className="text-gray-600">
              {basicDetails.Program} {basicDetails.Branch && `in ${basicDetails.Branch}`}
              {basicDetails.Batch && ` • Batch of ${basicDetails.Batch}`}
            </p>
            <div className="flex justify-center space-x-2 mt-2">
              <a 
                href={additionalDetails.linkedinUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaLinkedin className="h-4 w-4 mr-1" />
                <span className="text-sm">LinkedIn</span>
              </a>
              <a 
                href={additionalDetails.githubUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <FaGithub className="h-4 w-4 mr-1" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center px-6 border-b">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? "border-b-2 border-red-500 text-red-500" 
                  : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
              }`} 
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "Basic Details" && (
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-md border border-red-100 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-red-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <input
                        type="text"
                        className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        value={basicDetails.Name || ""}
                        onChange={(e) => handleChange("Basic Details", "Name", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-red-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                      <input
                        type="text"
                        className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        value={basicDetails["Date of birth"] || ""}
                        onChange={(e) => handleChange("Basic Details", "Date of birth", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-red-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Roll Number</p>
                      <input
                        type="text"
                        className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        value={basicDetails["Roll number"] || ""}
                        onChange={(e) => handleChange("Basic Details", "Roll number", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-red-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Program & Branch</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <input
                          type="text"
                          className="p-2 border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          placeholder="Program"
                          value={basicDetails.Program || ""}
                          onChange={(e) => handleChange("Basic Details", "Program", e.target.value)}
                          disabled={!editing}
                        />
                        <input
                          type="text"
                          className="p-2 border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          placeholder="Branch"
                          value={basicDetails.Branch || ""}
                          onChange={(e) => handleChange("Basic Details", "Branch", e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-red-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">College Email</p>
                    <input
                      type="email"
                      className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      value={basicDetails["College email"] || ""}
                      onChange={(e) => handleChange("Basic Details", "College email", e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-red-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Personal Email</p>
                    <input
                      type="email"
                      className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      value={basicDetails["Personal email"] || ""}
                      onChange={(e) => handleChange("Basic Details", "Personal email", e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-red-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      value={basicDetails.Phone || ""}
                      onChange={(e) => handleChange("Basic Details", "Phone", e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-red-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      value={basicDetails.Address || ""}
                      onChange={(e) => handleChange("Basic Details", "Address", e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                </div>

                {Object.entries(basicDetails)
                  .filter(([key]) => !["Name", "Date of birth", "Roll number", "Program", "Branch", 
                    "College email", "Personal email", "Phone", "Address"].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1">{key}:</label>
                      <input
                        type="text"
                        className="border p-2 rounded-md w-full bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        value={value}
                        onChange={(e) => handleChange("Basic Details", key, e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {activeTab === "Educational Details" && (
            <div>
              {renderEducationalDetails()}
            </div>
          )}

          {activeTab === "Additional Details" && (
            <div>
              {renderAdditionalDetails()}
            </div>
          )}

          {activeTab === "History" && (
            <div>
              {renderHistory()}
            </div>
          )}

          {/* Save button at bottom when editing */}
          {editing && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHelperComponent;