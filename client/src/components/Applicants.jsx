import React, { useState, useEffect } from "react";
import api from "../API/index";
import { toastService } from "./Toast";

const Applicants = ({ driveId }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Fetch applicants data
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!driveId) return;

      try {
        setLoading(true);
        const response = await api.get(
          `/coordinator/drive/applications/${driveId}`
        );
        setApplicants(response.data.applicants || []);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toastService.error("Failed to load applicants data");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [driveId]);

  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      applicant.roll_no?.toLowerCase().includes(searchText.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    // Handle new round-based status formats
    if (status.startsWith("Shortlisted for round")) {
      return "bg-green-100 text-green-800";
    }

    if (status.startsWith("Rejected in round")) {
      return "bg-red-100 text-red-800";
    }

    if (status.startsWith("Waitlisted in round")) {
      return "bg-yellow-100 text-yellow-800";
    }

    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Resume Shortlisted":
        return "bg-green-100 text-green-800";
      case "Interview I Selected":
        return "bg-purple-100 text-purple-800";
      case "Interview II Selected":
        return "bg-indigo-100 text-indigo-800";
      case "Final Selected":
        return "bg-emerald-100 text-emerald-800";
      case "Offer Extended":
        return "bg-purple-100 text-purple-800";
      case "Offer Accepted":
        return "bg-emerald-100 text-emerald-800";
      case "Offer Rejected":
        return "bg-red-100 text-red-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-gray-700 flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-coral-red border-t-transparent rounded-full animate-spin mb-4"></div>
          Loading applicants...
        </div>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center p-8">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-700">
            No Applications Yet
          </h3>
          <p className="text-gray-500 mt-2">
            No students have applied for this drive
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-ubuntu max-w-6xl mx-auto py-6">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mx-4">
        {/* Search Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, roll no, or email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="p-2 pl-8 w-full sm:w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-coral-red"
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

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              Total Applicants: <strong>{applicants.length}</strong>
            </span>
            <span>
              Showing: <strong>{filteredApplicants.length}</strong>
            </span>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border-t border-l border-gray-200 p-2 pl-3 rounded-tl-md font-medium">
                  Name
                </th>
                <th className="border-t border-gray-200 p-2 font-medium">
                  Roll No.
                </th>
                <th className="border-t border-gray-200 p-2 font-medium">
                  Email
                </th>
                <th className="border-t border-gray-200 p-2 font-medium">
                  Phone
                </th>
                <th className="border-t border-gray-200 p-2 font-medium">
                  CGPA
                </th>
                <th className="border-t border-gray-200 p-2 font-medium">
                  Resume
                </th>
                <th className="border-t border-gray-200 p-2 font-medium">
                  Applied Date
                </th>
                <th className="border-t border-r border-gray-200 p-2 text-center rounded-tr-md font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((applicant, index) => (
                  <tr
                    key={applicant.student_id}
                    className={`hover:bg-gray-50 ${
                      index === filteredApplicants.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="border-l border-gray-200 p-2 pl-3">
                      {applicant.name || "N/A"}
                    </td>
                    <td className="p-2">{applicant.roll_no || "N/A"}</td>
                    <td className="p-2">{applicant.email || "N/A"}</td>
                    <td className="p-2">{applicant.phone || "N/A"}</td>
                    <td className="p-2">{applicant.cgpa || "N/A"}</td>
                    <td className="p-2">
                      {applicant.resume_link &&
                      applicant.resume_link !== "N/A" ? (
                        <a
                          href={applicant.resume_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-coral-red hover:underline flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          View Resume
                        </a>
                      ) : (
                        <span className="text-gray-400">No Resume</span>
                      )}
                    </td>
                    <td className="p-2">
                      {applicant.applied_at
                        ? new Date(applicant.applied_at).toLocaleDateString()
                        : applicant.application_date
                        ? new Date(
                            applicant.application_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="border-r border-gray-200 p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          applicant.current_status || "Applied"
                        )}`}
                      >
                        {applicant.current_status || "Applied"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-8 text-center text-gray-500 border-l border-r border-b border-gray-200 rounded-b-md"
                  >
                    No applicants match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Student selection is now managed through the
            "Results" tab. Use the Results section to manage round-by-round
            selection process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
