import React from "react";

const DriveBasicDetails = ({ formData, handleChange }) => {
  return (
    <section className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Drive Details
      </h2>

      <div className="flex flex-col-reverse gap-8 lg:flex-row">
        {/* Form section */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 gap-6">
            <div className="form-group">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Roles
              </label>
              <input
                type="text"
                name="role"
                id="role"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter roles (e.g., Software Engineer, Product Manager)"
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
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.company_logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo section */}
        <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
          <div className="relative group">
            <div
              className={`w-32 h-32 rounded-full overflow-hidden shadow-md flex items-center justify-center ${
                formData.company_logo
                  ? ""
                  : "bg-gray-100 border-2 border-dashed border-gray-300"
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
                  <span className="text-gray-500 text-sm">Company Logo</span>
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
