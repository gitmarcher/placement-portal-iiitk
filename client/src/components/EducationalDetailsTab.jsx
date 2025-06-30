// src/components/profile/EducationalDetailsTab.jsx
import React from "react";
import { School } from "lucide-react";

const EducationalDetailsTab = ({ studentData, setStudentData, editing }) => {
  const handleChange = (key, value) => {
    setStudentData((prev) => ({
      ...prev,
      academics: { ...prev.academics, [key]: value }
    }));
  };

  const degrees = [
    {
      key: "tenth",
      label: "10th",
      fields: ["board_name", "percentage", "passing_year"]
    },
    {
      key: "twelfth",
      label: "12th",
      fields: ["board_name", "percentage", "passing_year"]
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {["cgpa", "graduation_year", "backlogs", "graduation_degree"].map(
          (key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {key === "cgpa"
                  ? "CGPA"
                  : key === "graduation_year"
                  ? "Graduation Year"
                  : key === "backlogs"
                  ? "Backlogs"
                  : "Graduation Degree"}
                :
              </label>
              <input
                type="text"
                className="border p-2 rounded-md w-full bg-white shadow-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={studentData.academics[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                disabled={key !== "cgpa" || !editing} // Only cgpa is editable when editing is true
              />
            </div>
          )
        )}
      </div>

      <h3 className="font-semibold text-gray-800 mb-4 mt-6">
        Education History
      </h3>
      <div className="space-y-6">
        {degrees.map(({ key, label, fields }) => {
          const hasData =
            studentData.academics[`${key}_board_name`] ||
            studentData.academics[`${key}_percentage`] ||
            studentData.academics[`${key}_passing_year`];
          if (!hasData && !editing) return null;

          return (
            <div key={key} className="p-4 border rounded-md bg-white shadow-sm">
              <div className="flex items-center mb-3">
                <School className="w-5 h-5 text-red-500 mr-2" />
                <h4 className="font-medium text-gray-800">{label}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      {field === "board_name"
                        ? "Board"
                        : field === "percentage"
                        ? "Percentage"
                        : "Passing Year"}
                      :
                    </label>
                    <input
                      type="text"
                      className="border p-2 rounded-md w-full focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      value={studentData.academics[`${key}_${field}`] || ""}
                      onChange={(e) =>
                        handleChange(`${key}_${field}`, e.target.value)
                      }
                      disabled={true} // Always disabled
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EducationalDetailsTab;
