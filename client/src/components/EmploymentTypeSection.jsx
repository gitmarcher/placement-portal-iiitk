import React from "react";

const EmploymentTypeSection = ({ formData, handleChange }) => {
  return (
    <section className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Employment Type
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Internship Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <input
              type="radio"
              name="employmentType"
              value="internship"
              id="internship"
              checked={formData.employmentType === "internship"}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="internship"
              className="text-xl font-medium text-gray-800 cursor-pointer"
            >
              Internship
            </label>
          </div>

          <div className="space-y-6">
            <div className="form-group">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter internship location"
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
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 months, 6 months"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="stipend"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stipend
              </label>
              <input
                type="text"
                name="stipend"
                id="stipend"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="Enter stipend amount"
              />
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="ppo-offered"
                  name="ppoOffered"
                  checked={formData.ppoOffered}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="ppo-offered"
                  className="font-medium text-gray-800 cursor-pointer"
                >
                  Pre-Placement Offer (PPO)
                </label>
              </div>

              <div className="space-y-6 pl-8">
                <div className="form-group">
                  <label
                    htmlFor="CTC"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CTC
                  </label>
                  <input
                    type="text"
                    name="CTC"
                    id="CTC"
                    className={`w-full border border-gray-300 rounded-lg p-3 transition ${
                      !formData.ppoOffered
                        ? "bg-gray-100 opacity-60"
                        : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    value={formData.CTC}
                    onChange={handleChange}
                    disabled={!formData.ppoOffered}
                    placeholder="Enter CTC if PPO offered"
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="locations"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location(s)
                  </label>
                  <input
                    type="text"
                    name="locations"
                    id="locations"
                    className={`w-full border border-gray-300 rounded-lg p-3 transition ${
                      !formData.ppoOffered
                        ? "bg-gray-100 opacity-60"
                        : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    value={formData.locations}
                    onChange={handleChange}
                    disabled={!formData.ppoOffered}
                    placeholder="Enter location(s) for PPO"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Time Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <input
              type="radio"
              name="employmentType"
              value="fulltime"
              id="fulltime"
              checked={formData.employmentType === "fulltime"}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="fulltime"
              className="text-xl font-medium text-gray-800 cursor-pointer"
            >
              Full Time
            </label>
          </div>

          <div className="space-y-6">
            <div className="form-group">
              <label
                htmlFor="fulltime-CTC"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CTC
              </label>
              <input
                type="text"
                name="CTC"
                id="fulltime-CTC"
                className={`w-full border border-gray-300 rounded-lg p-3 transition ${
                  formData.employmentType !== "fulltime"
                    ? "bg-gray-100 opacity-60"
                    : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }`}
                value={formData.CTC}
                onChange={handleChange}
                disabled={formData.employmentType !== "fulltime"}
                placeholder="Enter full-time CTC"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="fulltime-locations"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location(s)
              </label>
              <input
                type="text"
                name="locations"
                id="fulltime-locations"
                className={`w-full border border-gray-300 rounded-lg p-3 transition ${
                  formData.employmentType !== "fulltime"
                    ? "bg-gray-100 opacity-60"
                    : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }`}
                value={formData.locations}
                onChange={handleChange}
                disabled={formData.employmentType !== "fulltime"}
                placeholder="Enter full-time location(s)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmploymentTypeSection;
