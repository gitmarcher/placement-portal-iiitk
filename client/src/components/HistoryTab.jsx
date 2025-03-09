// src/components/profile/HistoryTab.jsx
import React from "react";

const HistoryTab = ({ studentData }) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600 text-sm">
              <th className="p-3 font-medium">#</th>
              <th className="p-3 font-medium">Drive ID</th>
              <th className="p-3 font-medium">Application Date</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {studentData.applied_drives.length > 0 ? (
              studentData.applied_drives.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-red-50"}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.drive_id || "N/A"}</td>
                  <td className="p-3">
                    {new Date(item.application_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{item.status || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTab;
