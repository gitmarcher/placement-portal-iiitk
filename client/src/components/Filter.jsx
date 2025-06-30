import React, { useState, useEffect } from "react";
import filter from "../assets/Vector.png";
import { FaSearch, FaCheck } from "react-icons/fa";

const Filter = ({
  onFiltersChange = () => {},
  initialFilters = {},
  availableBatches = ["2021", "2022", "2023", "2024", "2025"]
}) => {
  const [searchRole, setSearchRole] = useState(initialFilters.searchRole || "");
  const [status, setStatus] = useState(initialFilters.status || []);
  const [type, setType] = useState(initialFilters.type || []);
  const [location, setLocation] = useState(initialFilters.location || []);
  const [locationSearch, setLocationSearch] = useState(
    initialFilters.locationSearch || ""
  );
  const [batch, setBatch] = useState(initialFilters.batch || "");

  const toggleSelection = (option, selectedOptions, setSelectedOptions) => {
    let newSelection;
    if (selectedOptions.includes(option)) {
      newSelection = selectedOptions.filter((item) => item !== option);
    } else {
      newSelection = [...selectedOptions, option];
    }
    setSelectedOptions(newSelection);
  };

  // Send filter changes to parent component
  useEffect(() => {
    const filters = {
      searchRole: searchRole.trim(),
      status,
      type,
      location,
      locationSearch: locationSearch.trim(),
      batch
    };
    onFiltersChange(filters);
  }, [searchRole, status, type, location, locationSearch, batch]);

  const clearAllFilters = () => {
    setSearchRole("");
    setStatus([]);
    setType([]);
    setLocation([]);
    setLocationSearch("");
    setBatch("");
  };

  const hasActiveFilters =
    searchRole ||
    status.length > 0 ||
    type.length > 0 ||
    location.length > 0 ||
    locationSearch ||
    batch;

  return (
    <div className="p-6 mx-5 w-full">
      <div className="border-gray-200 border-3 shadow-[0_0_20px_rgba(0,0,0,0.3)] p-4 rounded-xl">
        <div className="flex flex-col justify-center items-center gap-5">
          <div className="image flex items-center gap-1 font-semibold text-lg">
            <img src={filter} alt="filter" className="h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-coral-red text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-coral-red hover:text-coral-red/80 underline"
            >
              Clear All Filters
            </button>
          )}

          {/* Search Role */}
          <div className="Search w-full max-w-md">
            <div className="relative flex items-center w-full mx-auto md:flex">
              <FaSearch className="absolute left-3 text-gray-400 font-normal" />
              <input
                type="text"
                placeholder="Search Role/Company"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-red"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="Status w-full max-w-md">
            <div className="flex flex-col items-center justify-center w-full p-2 rounded-lg border border-gray-500 relative">
              <div className="absolute -top-3 left-2 bg-white px-2 text-sm text-black font-medium">
                Status
                {status.length > 0 && (
                  <span className="ml-1 text-coral-red">({status.length})</span>
                )}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-2 p-2">
                {["live", "past"].map((option) => (
                  <div
                    key={option}
                    className="flex items-center justify-center space-x-2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => toggleSelection(option, status, setStatus)}
                  >
                    <span>
                      {option.charAt(0).toUpperCase() + option.slice(1)} Drives
                    </span>
                    <div
                      className={`w-4 h-4 border border-gray-500 rounded flex items-center justify-center ${
                        status.includes(option)
                          ? "border-coral-red bg-coral-red"
                          : "border-gray-500"
                      }`}
                    >
                      {status.includes(option) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div className="Type w-full max-w-md">
            <div className="flex flex-col items-center justify-center w-full p-2 rounded-lg border border-gray-500 relative">
              <div className="absolute -top-3 left-2 bg-white px-2 text-sm text-black font-medium">
                Type
                {type.length > 0 && (
                  <span className="ml-1 text-coral-red">({type.length})</span>
                )}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-2 p-2">
                {["Intern", "Intern + PPO", "Fulltime"].map((option) => (
                  <div
                    key={option}
                    className="flex items-center justify-center space-x-2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => toggleSelection(option, type, setType)}
                  >
                    <span>{option}</span>
                    <div
                      className={`w-4 h-4 border border-gray-500 rounded flex items-center justify-center ${
                        type.includes(option)
                          ? "border-coral-red bg-coral-red"
                          : "border-gray-500"
                      }`}
                    >
                      {type.includes(option) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div className="Location w-full max-w-md">
            <div className="flex flex-col items-center justify-center w-full p-2 rounded-lg border border-gray-500 relative">
              <div className="relative flex items-center w-full mt-2">
                <FaSearch className="absolute left-3 text-gray-400 font-normal" />
                <input
                  type="text"
                  placeholder="Search Location"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-red"
                />
              </div>
              <div className="absolute -top-3 left-2 bg-white px-2 text-sm text-black font-medium">
                Location
                {(location.length > 0 || locationSearch) && (
                  <span className="ml-1 text-coral-red">
                    ({location.length}
                    {locationSearch ? "+search" : ""})
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-2 p-2">
                {["Remote", "On-site"].map((option) => (
                  <div
                    key={option}
                    className="flex items-center justify-center space-x-2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() =>
                      toggleSelection(option, location, setLocation)
                    }
                  >
                    <span>{option}</span>
                    <div
                      className={`w-4 h-4 border border-gray-500 rounded flex items-center justify-center ${
                        location.includes(option)
                          ? "border-coral-red bg-coral-red"
                          : "border-gray-500"
                      }`}
                    >
                      {location.includes(option) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Batch Filter */}
          <div className="Batch w-full max-w-md">
            <div className="relative flex items-center w-full mx-auto md:flex">
              <input
                type="text"
                placeholder="Filter by batch (e.g., 2022,2023,2024)"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full p-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-red"
              />
              <div className="absolute -top-3 left-2 bg-white px-2 text-sm text-black font-medium">
                Batch
                {batch && <span className="ml-1 text-coral-red">✓</span>}
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="w-full max-w-md p-3 bg-gray-50 rounded-lg border">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Active Filters:
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {searchRole && (
                  <span className="bg-coral-red text-white px-2 py-1 rounded">
                    Search: {searchRole}
                  </span>
                )}
                {status.map((s) => (
                  <span
                    key={s}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                ))}
                {type.map((t) => (
                  <span
                    key={t}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    {t}
                  </span>
                ))}
                {location.map((l) => (
                  <span
                    key={l}
                    className="bg-purple-500 text-white px-2 py-1 rounded"
                  >
                    {l}
                  </span>
                ))}
                {locationSearch && (
                  <span className="bg-purple-400 text-white px-2 py-1 rounded">
                    Location: {locationSearch}
                  </span>
                )}
                {batch && (
                  <span className="bg-orange-500 text-white px-2 py-1 rounded">
                    Batch: {batch}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
