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
    const values = Array.isArray(formData.criteria[name])
      ? formData.criteria[name]
      : [];
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
                checked={values.includes(option.value)}
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
              htmlFor="criteria.minimumCGPA"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Minimum CGPA
            </label>
            <input
              type="text"
              name="criteria.minimumCGPA"
              id="criteria.minimumCGPA"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.criteria.minimumCGPA || ""}
              onChange={handleChange}
              placeholder="e.g., 7.5"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="criteria.backlogs"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Backlogs
            </label>
            <input
              type="text"
              name="criteria.backlogs"
              id="criteria.backlogs"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.criteria.backlogs || ""}
              onChange={handleChange}
              placeholder="e.g., 0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="criteria.tenth_percentage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              10th Percentage
            </label>
            <input
              type="text"
              name="criteria.tenth_percentage"
              id="criteria.tenth_percentage"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.criteria.tenth_percentage || ""}
              onChange={handleChange}
              placeholder="e.g., 85%"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="criteria.twelfth_percentage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              12th Percentage
            </label>
            <input
              type="text"
              name="criteria.twelfth_percentage"
              id="criteria.twelfth_percentage"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.criteria.twelfth_percentage || ""}
              onChange={handleChange}
              placeholder="e.g., 80%"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="criteria.graduation_degree"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Graduation Degree
            </label>
            <input
              type="text"
              name="criteria.graduation_degree"
              id="criteria.graduation_degree"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.criteria.graduation_degree || ""}
              onChange={handleChange}
              placeholder="e.g., B.Tech"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="criteria.graduation_year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Graduation Year
            </label>
            <input
              type="text"
              name="criteria.graduation_year"
              id="criteria.graduation_year"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
              value={formData.criteria.graduation_year || ""}
              onChange={handleChange}
              placeholder="e.g., 2025"
            />
          </div>
        </div>
        <div className="form-group">
          <label
            htmlFor="criteria.work_experience_count"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Years of Experience
          </label>
          <input
            type="text"
            name="criteria.work_experience_count"
            id="criteria.work_experience_count"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-0 focus:outline-none focus:border-blue-500 transition"
            value={formData.criteria.work_experience_count || ""}
            onChange={handleChange}
            placeholder="e.g., 0 (for freshers)"
          />
        </div>
      </div>
    </section>
  );
};

export default EligibilitySection;
