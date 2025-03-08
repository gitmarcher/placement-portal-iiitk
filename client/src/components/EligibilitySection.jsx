import React from "react";

const EligibilitySection = ({
  formData,
  handleChange,
  handleCheckboxChange
}) => {
  const yearSemesterOptions = [
    { value: "1st", label: "1st year (SEM I-II)" },
    { value: "2nd", label: "2nd year (SEM III-IV)" },
    { value: "3rd", label: "3rd year (SEM V-VI)" },
    { value: "4th", label: "4th year (SEM VII-VIII)" }
  ];

  const streamOptions = [
    { value: "CSE", label: "CSE" },
    { value: "CSY", label: "CSY" },
    { value: "AIDS", label: "AI-DS" },
    { value: "ECE", label: "ECE" }
  ];

  const CheckBox = ({ label, name, options }) => {
    return (
      <div className="form-group mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
        <div className="flex flex-wrap gap-4">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`${name}-${index}`}
                name={name}
                value={option.value}
                className="w-5 h-5 text-blue-600 rounded focus:ring-0 focus:ring-offset-0 border-gray-300 cursor-pointer"
                checked={formData[name].includes(option.value)}
                onChange={() => handleCheckboxChange(name, option.value)}
              />
              <label
                htmlFor={`${name}-${index}`}
                className="ml-2 text-gray-700 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Eligibility
      </h2>

      <div className="space-y-6">
        <CheckBox
          label="Year/Semester"
          name="yearSemester"
          options={yearSemesterOptions}
        />

        <CheckBox label="Stream" name="stream" options={streamOptions} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="minimumCGPA"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Minimum CGPA
            </label>
            <input
              type="text"
              name="minimumCGPA"
              id="minimumCGPA"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.minimumCGPA}
              onChange={handleChange}
              placeholder="e.g., 7.5"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="backlogs"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Backlogs
            </label>
            <input
              type="text"
              name="backlogs"
              id="backlogs"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.backlogs}
              onChange={handleChange}
              placeholder="e.g., 0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="tenth_percentage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              10th Percentage
            </label>
            <input
              type="text"
              name="tenth_percentage"
              id="tenth_percentage"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.tenth_percentage}
              onChange={handleChange}
              placeholder="e.g., 85%"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="twelfth_percentage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              12th Percentage
            </label>
            <input
              type="text"
              name="twelfth_percentage"
              id="twelfth_percentage"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.twelfth_percentage}
              onChange={handleChange}
              placeholder="e.g., 80%"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="graduation_degree"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Graduation Degree
            </label>
            <input
              type="text"
              name="graduation_degree"
              id="graduation_degree"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.graduation_degree}
              onChange={handleChange}
              placeholder="e.g., B.Tech"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="graduation_year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Graduation Year
            </label>
            <input
              type="text"
              name="graduation_year"
              id="graduation_year"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.graduation_year}
              onChange={handleChange}
              placeholder="e.g., 2025"
            />
          </div>
        </div>

        <div className="form-group">
          <label
            htmlFor="work_experience_count"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Years of Experience
          </label>
          <input
            type="text"
            name="work_experience_count"
            id="work_experience_count"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
            value={formData.work_experience_count}
            onChange={handleChange}
            placeholder="e.g., 0 (for freshers)"
          />
        </div>
      </div>
    </section>
  );
};

export default EligibilitySection;
