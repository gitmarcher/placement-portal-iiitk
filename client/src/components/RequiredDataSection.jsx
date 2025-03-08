import React from "react";

const RequiredDataSection = ({ formData, handleCheckboxChange }) => {
  const requiredDataOptions = [
    { value: "name", label: "Name" },
    { value: "gender", label: "Gender" },
    { value: "roll", label: "Roll Number" },
    { value: "email", label: "Email Id" },
    { value: "personalEmail", label: "Personal Email Id" },
    { value: "cgpa", label: "CGPA" },
    { value: "backlogs", label: "Backlogs" },
    { value: "phone", label: "Phone Number" },
    { value: "resume", label: "Resume" },
    { value: "batch", label: "Batch" },
    { value: "branch", label: "Branch" },
    { value: "dob", label: "Date of Birth" },
    { value: "12th", label: "12th Percentage" },
    { value: "10th", label: "10th Percentage" },
    { value: "address", label: "Address" },
    { value: "skills", label: "Skills" },
    { value: "work", label: "Work Experience" },
    { value: "github", label: "Github Profile" },
    { value: "linkedin", label: "Linkedin Profile" },
    { value: "location", label: "Location Preference" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Required Student Data:
        </h2>
        <p className="text-sm text-gray-600 italic">
          *Select items in order of their sheet placement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {requiredDataOptions.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`required-${option.value}`}
              checked={formData.requiredData.includes(option.value)}
              onChange={() =>
                handleCheckboxChange("requiredData", option.value)
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`required-${option.value}`}
              className="ml-2 text-sm font-medium text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {/* Container for displaying selected data */}
      <div
        className={`mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 ${
          formData.requiredData.length > 0 ? "block" : "hidden"
        }`}
      >
        {/* Display selected data with wrapping */}
        <div className="flex flex-wrap gap-2">
          {formData.requiredData.map((data, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
            >
              {data}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequiredDataSection;
