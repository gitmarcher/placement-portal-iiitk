import React, { useState, useEffect } from "react";
import API from "../API";
import { toastService } from "./Toast";

const PlacementTracker = () => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch available batches on component mount
  useEffect(() => {
    fetchAvailableBatches();
  }, []);

  const fetchAvailableBatches = async () => {
    try {
      const response = await API.get("/coordinator/drive/placement/batches");
      setAvailableBatches(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      toastService.error("Failed to fetch available batches");
    }
  };

  const fetchStatistics = async (batch) => {
    try {
      setLoading(true);
      const response = await API.get(
        `/coordinator/drive/placement/statistics/${batch}`
      );
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toastService.error("Failed to fetch placement statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (batch, search = "") => {
    try {
      setLoading(true);
      const response = await API.get(
        `/coordinator/drive/placement/students/${batch}?search=${encodeURIComponent(
          search
        )}`
      );
      setStudentDetails(response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toastService.error("Failed to fetch student details");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChange = (batch) => {
    setSelectedBatch(batch);
    setShowStudentDetails(false);
    setSearchText("");
    if (batch) {
      fetchStatistics(batch);
    } else {
      setStatistics(null);
      setStudentDetails(null);
    }
  };

  const handleShowStudentDetails = () => {
    if (selectedBatch) {
      setShowStudentDetails(true);
      fetchStudentDetails(selectedBatch, searchText);
    }
  };

  const handleSearch = () => {
    if (selectedBatch && showStudentDetails) {
      fetchStudentDetails(selectedBatch, searchText);
    }
  };

  const formatCompensation = (ctc, stipend, roleType) => {
    const parts = [];

    if (roleType === "Intern" && stipend && stipend !== "N/A") {
      parts.push(`₹${stipend}/month`);
    } else if (roleType === "Fulltime" && ctc && ctc !== "N/A") {
      parts.push(`₹${ctc} LPA`);
    } else if (roleType === "Intern + PPO") {
      if (stipend && stipend !== "N/A")
        parts.push(`₹${stipend}/month (Intern)`);
      if (ctc && ctc !== "N/A") parts.push(`₹${ctc} LPA (PPO)`);
    }

    return parts.length > 0 ? parts.join(" + ") : "Not Available";
  };

  return (
    <div className="font-ubuntu max-w-7xl mx-auto py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Placement Tracker
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Track placement statistics and student details by graduation year
            </p>
          </div>

          {/* Batch Selector */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <label
              htmlFor="batch"
              className="text-sm font-medium text-gray-700"
            >
              Select Graduation Year:
            </label>
            <select
              id="batch"
              value={selectedBatch}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-red focus:border-transparent"
            >
              <option value="">Choose a graduation year...</option>
              {availableBatches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {statistics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Placement Statistics - Graduation Year {statistics.batch}
            </h3>
            <button
              onClick={handleShowStudentDetails}
              className="px-4 py-2 bg-coral-red text-white rounded-lg hover:bg-coral-red/90 transition-colors text-sm font-medium"
            >
              Show Student Details
            </button>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Placement Rate
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {statistics.placementPercentage}%
                  </p>
                  <p className="text-blue-600 text-xs">
                    {statistics.placedStudents} / {statistics.totalStudents}{" "}
                    students
                  </p>
                </div>
                <div className="text-blue-500">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Average CTC
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    ₹{statistics.avgCTC}
                  </p>
                  <p className="text-green-600 text-xs">LPA</p>
                </div>
                <div className="text-green-500">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">
                    Average Stipend
                  </p>
                  <p className="text-2xl font-bold text-purple-800">
                    ₹{statistics.avgStipend}
                  </p>
                  <p className="text-purple-600 text-xs">per month</p>
                </div>
                <div className="text-purple-500">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">
                    Companies Visited
                  </p>
                  <p className="text-2xl font-bold text-orange-800">
                    {statistics.totalCompanies}
                  </p>
                  <p className="text-orange-600 text-xs">unique companies</p>
                </div>
                <div className="text-orange-500">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Compensation Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Median CTC:</span>
                  <span className="font-medium">
                    ₹{statistics.medianCTC} LPA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Median Stipend:</span>
                  <span className="font-medium">
                    ₹{statistics.medianStipend}/month
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Top Companies</h4>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {statistics.companiesVisited
                  .slice(0, 5)
                  .map((company, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {company}
                    </div>
                  ))}
                {statistics.companiesVisited.length > 5 && (
                  <div className="text-xs text-gray-500">
                    +{statistics.companiesVisited.length - 5} more companies
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Details */}
      {showStudentDetails && studentDetails && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Student Details - Batch {studentDetails.batch}
            </h3>

            {/* Search */}
            <div className="flex gap-2 mt-4 sm:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-8 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-coral-red"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400 absolute left-2 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-coral-red text-white rounded-md hover:bg-coral-red/90 transition-colors text-sm"
              >
                Search
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                <strong>Total Students:</strong> {studentDetails.totalStudents}
              </span>
              <span>
                <strong>Placed Students:</strong>{" "}
                {studentDetails.placedStudents}
              </span>
              <span>
                <strong>Unplaced Students:</strong>{" "}
                {studentDetails.totalStudents - studentDetails.placedStudents}
              </span>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Stream
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    CGPA
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Company
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Compensation
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentDetails.students.map((student, index) => (
                  <tr
                    key={student.student_id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.roll_no}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {student.stream}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-700">
                      {student.cgpa}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.isPlaced
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.isPlaced ? "Placed" : "Unplaced"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {student.placement ? student.placement.company : "-"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {student.placement
                        ? formatCompensation(
                            student.placement.ctc,
                            student.placement.stipend,
                            student.placement.role_type
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {studentDetails.students.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-700">
                No students found
              </h3>
              <p className="text-gray-500 mt-2">
                {searchText
                  ? `No students match your search criteria "${searchText}"`
                  : "No students in this batch"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coral-red"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Empty State */}
      {!selectedBatch && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-gray-700">
            Select a Batch to View Placement Data
          </h3>
          <p className="text-gray-500 mt-2">
            Choose a batch from the dropdown above to view placement statistics
            and student details.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlacementTracker;
