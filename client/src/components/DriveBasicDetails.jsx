import React from "react";

const DriveBasicDetails = ({ formData, handleChange }) => {
  return (
    <section className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Drive Details
      </h2>
      <div className="flex flex-col-reverse gap-8 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 gap-6">
            <div className="form-group">
              <label
                htmlFor="company_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                id="company_name"
                className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="type_of_role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type of Role
              </label>
              <select
                name="type_of_role"
                id="type_of_role"
                className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                value={formData.type_of_role}
                onChange={handleChange}
              >
                <option value="">Select role type</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship + PPO">Internship + PPO</option>
                <option value="PPO">PPO</option>
              </select>
            </div>
            <div className="form-group">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location(s)
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter locations, comma-separated (e.g., Mumbai, Pune)"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="ctc"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CTC
              </label>
              <input
                type="text"
                name="ctc"
                id="ctc"
                className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                value={formData.ctc}
                onChange={handleChange}
                placeholder="e.g., 5 LPA"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration
              </label>
              <input
                type="text"
                name="duration"
                id="duration"
                className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 6 months, Full-time"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="company_logo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Logo URL
              </label>
              <input
                type="text"
                name="company_logo"
                id="company_logo"
                className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                value={formData.company_logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label
                  htmlFor="drive_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Drive Date
                </label>
                <input
                  type="date"
                  name="drive_date"
                  id="drive_date"
                  className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                  value={formData.drive_date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  id="deadline"
                  className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="drive_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Drive Name
              </label>
              <input
                type="text"
                name="drive_name"
                id="drive_name"
                className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                value={formData.drive_name}
                onChange={handleChange}
                placeholder="Enter drive name"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="number_of_positions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Number of Positions
              </label>
              <input
                type="number"
                name="number_of_positions"
                id="number_of_positions"
                className="w-full border border-[#DDDDDD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:border-[#EB3030] transition"
                value={formData.number_of_positions}
                onChange={handleChange}
                placeholder="Enter number of positions"
                min="1"
              />
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
          <div className="relative group">
            <div
              className={`w-32 h-32 rounded-full overflow-hidden shadow-md flex items-center justify-center ${
                formData.company_logo
                  ? ""
                  : "bg-[#FDE6E6] border-2 border-dashed border-[#DDDDDD]"
              }`}
            >
              {formData.company_logo ? (
                <img
                  src={formData.company_logo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2">
                  <span className="text-[#DDDDDD] text-sm">Company Logo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DriveBasicDetails;
