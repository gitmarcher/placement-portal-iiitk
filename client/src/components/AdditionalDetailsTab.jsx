// src/components/profile/AdditionalDetailsTab.jsx
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { ArrowLeft } from "lucide-react";

const AdditionalDetailsTab = ({ studentData, setStudentData, editing }) => {
  const handleChange = (key, value) => {
    setStudentData((prev) => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (key, index, value) => {
    setStudentData((prev) => {
      const newArray = [...prev[key]];
      newArray[index] = value;
      return { ...prev, [key]: newArray };
    });
  };

  const handleAddItem = (key) => {
    setStudentData((prev) => ({
      ...prev,
      [key]: [...prev[key], ""] // Add an empty string as a new item
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <a
            href={studentData.linkedin_profile || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <FaLinkedin className="h-6 w-6" />
          </a>
          <a
            href={studentData.github_profile || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            <FaGithub className="h-6 w-6" />
          </a>
        </div>
        <a
          href={studentData.resume_link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <span>Resume</span>
          <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180" />
        </a>
      </div>

      <div>
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Skills</h3>
          {editing && (
            <button
              onClick={() => handleAddItem("additional_skills")}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              + Add Skill
            </button>
          )}
        </div>
        <div className="bg-gray-50 p-6 rounded-md border">
          <ul className="list-disc pl-5 space-y-2">
            {studentData.additional_skills.length > 0 ? (
              studentData.additional_skills.map((skill, index) => (
                <li key={index} className="text-gray-800">
                  {editing ? (
                    <input
                      type="text"
                      className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      value={skill}
                      onChange={(e) =>
                        handleArrayChange(
                          "additional_skills",
                          index,
                          e.target.value
                        )
                      }
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
          <h3 className="font-semibold text-gray-800">Work Experience</h3>
          {editing && (
            <button
              onClick={() => handleAddItem("work_experience")}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              + Add Experience
            </button>
          )}
        </div>
        <div className="bg-gray-50 p-6 rounded-md border">
          <ul className="list-disc pl-5 space-y-2">
            {studentData.work_experience.length > 0 ? (
              studentData.work_experience.map((exp, index) => (
                <li key={index} className="text-gray-800">
                  {editing ? (
                    <input
                      type="text"
                      className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      value={exp}
                      onChange={(e) =>
                        handleArrayChange(
                          "work_experience",
                          index,
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <span>{exp}</span>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">
                No work experience listed
              </p>
            )}
          </ul>
        </div>
      </div>

      {editing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL:
            </label>
            <input
              type="text"
              className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.linkedin_profile || ""}
              onChange={(e) => handleChange("linkedin_profile", e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              GitHub URL:
            </label>
            <input
              type="text"
              className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.github_profile || ""}
              onChange={(e) => handleChange("github_profile", e.target.value)}
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Resume URL:
            </label>
            <input
              type="text"
              className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.resume_link || ""}
              onChange={(e) => handleChange("resume_link", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalDetailsTab;
