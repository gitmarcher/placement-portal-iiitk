import React from "react";

const EligibilitySection = ({
  formData,
  handleChange,
  handleCheckboxChange
}) => {
  const streamOptions = [
    { value: "ALL", label: "ALL" },
    { value: "CSE", label: "CSE" },
    { value: "ECE", label: "ECE" },
    { value: "AIDS", label: "AI-DS" },
    { value: "CSY", label: "CSY" }
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
                className="w-5 h-5 text-[#EB3030] rounded focus:ring-0 focus:ring-offset-0 border-[#DDDDDD] cursor-pointer"
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
        <CheckBox label="Stream" name="stream" options={streamOptions} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="criteria.cgpa"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Minimum CGPA
            </label>
            <input
              type="text"
              name="criteria.cgpa"
              id="criteria.cgpa"
              className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
              value={formData.criteria.cgpa || ""}
              onChange={handleChange}
              placeholder="e.g., 7.5"
            />
          </div>
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
              className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
              value={formData.criteria.tenth_percentage || ""}
              onChange={handleChange}
              placeholder="e.g., 85"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
              value={formData.criteria.twelfth_percentage || ""}
              onChange={handleChange}
              placeholder="e.g., 80"
            />
          </div>
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
              className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
              value={formData.criteria.graduation_degree || ""}
              onChange={handleChange}
              placeholder="e.g., B.Tech"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="criteria.graduation_year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Graduation Year(s)
            </label>
            <input
              type="text"
              name="criteria.graduation_year"
              id="criteria.graduation_year"
              className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
              value={formData.criteria.graduation_year || ""}
              onChange={handleChange}
              placeholder="e.g., 2023, 2024"
            />
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
              className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
              value={formData.criteria.work_experience_count || ""}
              onChange={handleChange}
              placeholder="e.g., 0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="criteria.max_backlogs"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maximum Backlogs Allowed
            </label>
            <input
              type="text"
              name="criteria.max_backlogs"
              id="criteria.max_backlogs"
              className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
              value={formData.criteria.max_backlogs || ""}
              onChange={handleChange}
              placeholder="e.g., 0 (no backlogs), 1, 2"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="criteria.eligible_batches"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Eligible Batches
            </label>
            <input
              type="text"
              name="criteria.eligible_batches"
              id="criteria.eligible_batches"
              className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
              value={formData.criteria.eligible_batches || ""}
              onChange={handleChange}
              placeholder="e.g., 2022,2023,2024"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EligibilitySection;
