// src/components/profile/Profile.jsx
import React, { useState } from "react";
import { ArrowLeft, Edit } from "lucide-react";
import { useStudentDetails } from "../contexts/StudentDetailsContext";
import BasicDetailsTab from "./BasicDetailsTab";
import EducationalDetailsTab from "./EducationalDetailsTab";
import AdditionalDetailsTab from "./AdditionalDetailsTab";
import HistoryTab from "./HistoryTab";
import updateProfile from "../API/updateProfile"; // Imported API function
import { toastService } from "./Toast";

const Profile = () => {
  const { studentData, setStudentData } = useStudentDetails();
  const [activeTab, setActiveTab] = useState("Basic Details");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false); // Track saving state

  const tabs = [
    "Basic Details",
    "Educational Details",
    "Additional Details",
    "History"
  ];

  // Function to handle saving profile updates to the backend
  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare data in the backend-expected format (matches previous backend response)
      const updatedProfileData = {
        roll_no: studentData.roll_no,
        name: studentData.name,
        email_id: studentData.email_id,
        stream: studentData.stream,
        phone_no: studentData.phone_no,
        gender: studentData.gender,
        additional_skills: studentData.additional_skills,
        work_experience: studentData.work_experience,
        digital_locker: studentData.digital_locker,
        resume_link: studentData.resume_link,
        linkedin_profile: studentData.linkedin_profile,
        github_profile: studentData.github_profile,
        address: {
          street: studentData.address.street,
          city: studentData.address.city,
          state: studentData.address.state,
          district: studentData.address.district,
          pin_code: studentData.address.pin_code
        },
        academics: {
          tenth_board_name: studentData.academics.tenth_board_name,
          tenth_percentage: studentData.academics.tenth_percentage,
          tenth_passing_year: studentData.academics.tenth_passing_year,
          twelfth_board_name: studentData.academics.twelfth_board_name,
          twelfth_percentage: studentData.academics.twelfth_percentage,
          twelfth_passing_year: studentData.academics.twelfth_passing_year,
          graduation_degree: studentData.academics.graduation_degree,
          graduation_year: studentData.academics.graduation_year,
          cgpa: studentData.academics.cgpa,
          backlogs: studentData.academics.backlogs
        },
        applied_drives: studentData.applied_drives
      };

      // Call the updateProfile API function
      const response = await updateProfile(updatedProfileData);

      if (response.success) {
        toastService.success("Profile updated successfully");
        setEditing(false); // Exit edit mode on success
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toastService.error("Failed to update profile. Please try again");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (editing) {
      handleSave(); // Save changes when toggling off edit mode
    } else {
      setEditing(true); // Enter edit mode
    }
  };

  console.log("Student data:", studentData);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-neutral-200 p-6 pb-20 relative">
          <div className="flex justify-between items-center mb-4">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleEdit}
              disabled={saving}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                editing
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-white hover:bg-gray-100 text-red-500"
              } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Edit className="h-4 w-4 mr-2" />
              {editing
                ? saving
                  ? "Saving..."
                  : "Save Changes"
                : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="flex justify-center -mt-14 mb-4 relative z-10">
          <div className="w-24 h-24 rounded-full bg-red-300 flex items-center justify-center text-white font-semibold text-sm border-4 border-white shadow-md">
            {studentData.name ? (
              <span className="text-xl font-bold">
                {studentData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            ) : (
              "No photo."
            )}
          </div>
        </div>

        {studentData.name && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {studentData.name}
            </h2>
            <p className="text-gray-600">{studentData.stream}</p>
          </div>
        )}

        <div className="flex justify-center px-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-red-500 text-red-500"
                  : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "Basic Details" && (
            <BasicDetailsTab
              studentData={studentData}
              setStudentData={setStudentData}
              editing={editing}
            />
          )}
          {activeTab === "Educational Details" && (
            <EducationalDetailsTab
              studentData={studentData}
              setStudentData={setStudentData}
              editing={editing}
            />
          )}
          {activeTab === "Additional Details" && (
            <AdditionalDetailsTab
              studentData={studentData}
              setStudentData={setStudentData}
              editing={editing}
            />
          )}
          {activeTab === "History" && <HistoryTab studentData={studentData} />}
          {editing && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
