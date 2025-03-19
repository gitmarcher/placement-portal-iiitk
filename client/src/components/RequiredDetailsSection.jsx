import React from "react";
import { FaTimes } from "react-icons/fa";

const RequiredDetailsSection = ({ formData, handleCheckboxChange }) => {
  // Define mapping of variable names to user-friendly labels
  const detailOptions = [
    { value: "name", label: "Full Name" },
    { value: "gender", label: "Gender" },
    { value: "roll", label: "Roll Number" },
    { value: "email", label: "Email Address" },
    { value: "personalEmail", label: "Personal Email" },
    { value: "cgpa", label: "CGPA" },
    { value: "backlogs", label: "Backlogs" },
    { value: "phone", label: "Phone Number" },
    { value: "resume", label: "Resume" },
    { value: "batch", label: "Batch Year" },
    { value: "branch", label: "Branch" },
    { value: "dob", label: "Date of Birth" },
    { value: "12th", label: "12th Grade Percentage" },
    { value: "10th", label: "10th Grade Percentage" },
    { value: "address", label: "Address" },
    { value: "skills", label: "Skills" },
    { value: "work", label: "Work Experience" },
    { value: "github", label: "GitHub Profile" },
    { value: "linkedin", label: "LinkedIn Profile" },
    { value: "location", label: "Preferred Location" }
  ];

  const selectedDetails = formData.required_details || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-[#DDDDDD]">
        Required Student Details
      </h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600 italic">
          Select details in the order you want them to appear.
        </p>
      </div>
      {/* Checkbox list */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {detailOptions.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              id={option.value}
              value={option.value}
              checked={selectedDetails.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="w-5 h-5 text-[#EB3030] rounded focus:ring-0 focus:ring-offset-0 border-[#DDDDDD] cursor-pointer"
            />
            <label
              htmlFor={option.value}
              className="ml-2 text-gray-700 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {/* Display selected details */}
      {selectedDetails.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Selected Details (in order):
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedDetails.map((detail, index) => {
              // Find the corresponding label for the selected detail
              const displayLabel =
                detailOptions.find((opt) => opt.value === detail)?.label ||
                detail;
              return (
                <div
                  key={index}
                  className="flex items-center bg-[#FDE6E6] text-[#EB3030] px-3 py-1 rounded-full"
                >
                  <span>{displayLabel}</span>
                  <button
                    type="button"
                    onClick={() => handleCheckboxChange(detail)}
                    className="ml-2 text-[#EB3030] hover:text-red-700"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequiredDetailsSection;
