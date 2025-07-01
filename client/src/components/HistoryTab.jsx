// src/components/profile/HistoryTab.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoDocumentTextOutline, IoOpenOutline } from "react-icons/io5";
import api from "../API";
import { toastService } from "./Toast";

const HistoryTab = ({ studentData }) => {
  const [enrichedHistory, setEnrichedHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const enrichApplicationHistory = async () => {
      if (
        !studentData.applied_drives ||
        studentData.applied_drives.length === 0
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const enrichedData = await Promise.all(
          studentData.applied_drives.map(async (application) => {
            try {
              // Fetch drive details to get company name and drive name
              const driveResponse = await api.get(
                `/student/drive/${application.drive_id}`
              );

              // Fetch application details to get resume link and other application-specific data
              let applicationDetails = null;
              try {
                const appResponse = await api.get(
                  `/student/drive/application-details/${application.drive_id}`
                );
                applicationDetails = appResponse.data.application;
              } catch (appError) {
                console.log(
                  `No application details found for drive ${application.drive_id}`
                );
              }

              if (driveResponse.data) {
                return {
                  ...application,
                  company_name:
                    driveResponse.data.company_name || "Unknown Company",
                  drive_name:
                    driveResponse.data.drive_name || "Unknown Position",
                  company_logo: driveResponse.data.company_logo,
                  isActive: driveResponse.data.isActive,
                  acceptingApplications:
                    driveResponse.data.acceptingApplications,
                  // Application-specific details
                  resumeLink: applicationDetails?.resumeLink,
                  applicationPhone: applicationDetails?.phone,
                  applicationTimestamp:
                    applicationDetails?.applicationTimestamp,
                  current_status:
                    applicationDetails?.current_status || application.status
                };
              }
              return {
                ...application,
                company_name: "Unknown Company",
                drive_name: "Unknown Position",
                isActive: false,
                acceptingApplications: false
              };
            } catch (error) {
              console.error(
                `Error fetching drive ${application.drive_id}:`,
                error
              );
              return {
                ...application,
                company_name: "Unknown Company",
                drive_name: "Unknown Position",
                isActive: false,
                acceptingApplications: false
              };
            }
          })
        );
        setEnrichedHistory(enrichedData);
      } catch (error) {
        console.error("Error enriching application history:", error);
        toastService.error("Failed to load application history details");
      } finally {
        setLoading(false);
      }
    };

    enrichApplicationHistory();
  }, [studentData.applied_drives]);

  const handleRowClick = (driveId) => {
    navigate(`/drive/${driveId}`);
  };

  const handleResumeClick = (e, resumeLink) => {
    e.stopPropagation(); // Prevent row click
    if (resumeLink) {
      window.open(resumeLink, "_blank");
    } else {
      toastService.info("Resume link not available");
    }
  };

  const getStatusBadge = (status, isActive) => {
    let badgeClasses = "px-2 py-1 rounded-full text-xs font-medium ";

    if (
      !isActive &&
      status !== "Final Selected" &&
      status !== "Offer Rejected"
    ) {
      badgeClasses += "bg-gray-100 text-gray-600";
      return <span className={badgeClasses}>Drive Ended</span>;
    }

    // Handle new round-based status formats
    if (status.startsWith("Shortlisted for round")) {
      badgeClasses += "bg-green-100 text-green-800";
      return <span className={badgeClasses}>{status}</span>;
    }

    if (status.startsWith("Rejected in round")) {
      badgeClasses += "bg-red-100 text-red-800";
      return <span className={badgeClasses}>{status}</span>;
    }

    if (status.startsWith("Waitlisted in round")) {
      badgeClasses += "bg-yellow-100 text-yellow-800";
      return <span className={badgeClasses}>{status}</span>;
    }

    switch (status) {
      case "Applied":
        badgeClasses += "bg-blue-100 text-blue-800";
        break;
      case "Resume Shortlisted":
        badgeClasses += "bg-green-100 text-green-800";
        break;
      case "Interview I Selected":
        badgeClasses += "bg-purple-100 text-purple-800";
        break;
      case "Interview II Selected":
        badgeClasses += "bg-indigo-100 text-indigo-800";
        break;
      case "Final Selected":
        badgeClasses += "bg-emerald-100 text-emerald-800";
        break;
      case "Offer Extended":
        badgeClasses += "bg-purple-100 text-purple-800";
        break;
      case "Offer Accepted":
        badgeClasses += "bg-emerald-100 text-emerald-800";
        break;
      case "Offer Rejected":
        badgeClasses += "bg-red-100 text-red-800";
        break;
      case "Shortlisted":
        badgeClasses += "bg-green-100 text-green-800";
        break;
      case "Selected":
        badgeClasses += "bg-emerald-100 text-emerald-800";
        break;
      case "Rejected":
        badgeClasses += "bg-red-100 text-red-800";
        break;
      case "Under Review":
        badgeClasses += "bg-orange-100 text-orange-800";
        break;
      case "Waitlisted - Round 1":
      case "Waitlisted - Round 2":
      case "Waitlisted - Round 3":
        badgeClasses += "bg-yellow-100 text-yellow-800";
        break;
      default:
        badgeClasses += "bg-gray-100 text-gray-600";
    }

    return <span className={badgeClasses}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-red"></div>
        <span className="ml-2 text-gray-600">
          Loading application history...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile view - Card layout */}
      <div className="block lg:hidden space-y-3">
        {enrichedHistory.length > 0 ? (
          enrichedHistory.map((item, index) => (
            <div
              key={index}
              onClick={() => handleRowClick(item.drive_id)}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-coral-red transition-all duration-200 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {item.company_logo && (
                  <img
                    src={item.company_logo}
                    alt={item.company_name}
                    className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.company_name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {item.drive_name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      Applied:{" "}
                      {new Date(item.application_date).toLocaleDateString()}
                    </span>
                    {getStatusBadge(
                      item.current_status || item.status,
                      item.isActive
                    )}
                  </div>
                  {/* Resume link for mobile */}
                  {item.resumeLink && (
                    <div className="mt-2">
                      <button
                        onClick={(e) => handleResumeClick(e, item.resumeLink)}
                        className="inline-flex items-center gap-1 text-xs text-coral-red hover:text-coral-red/80 font-medium"
                      >
                        <IoDocumentTextOutline className="w-3 h-3" />
                        View Resume
                        <IoOpenOutline className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Applications Yet
            </h3>
            <p className="text-gray-500">
              You haven't applied to any drives yet
            </p>
          </div>
        )}
      </div>

      {/* Desktop view - Table layout */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company & Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enrichedHistory.length > 0 ? (
                enrichedHistory.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleRowClick(item.drive_id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.company_logo && (
                          <img
                            src={item.company_logo}
                            alt={item.company_name}
                            className="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-200 mr-3 p-1"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.company_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.drive_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.application_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(
                        item.current_status || item.status,
                        item.isActive
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.resumeLink ? (
                        <button
                          onClick={(e) => handleResumeClick(e, item.resumeLink)}
                          className="inline-flex items-center gap-1 text-coral-red hover:text-coral-red/80 font-medium"
                        >
                          <IoDocumentTextOutline className="w-4 h-4" />
                          View Resume
                          <IoOpenOutline className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Not Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-coral-red hover:text-coral-red/80 font-medium">
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="text-gray-400 text-4xl mb-2">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No Applications Yet
                    </h3>
                    <p className="text-gray-500">
                      You haven't applied to any drives yet
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
