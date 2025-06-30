// src/components/profile/BasicDetailsTab.jsx
import React from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";

const BasicDetailsTab = ({ studentData, setStudentData, editing }) => {
  const handleChange = (key, value) => {
    let processedValue = value;

    // Capitalize roll number automatically
    if (key === "roll_no") {
      processedValue = value.toUpperCase();
    }

    setStudentData((prev) => ({ ...prev, [key]: processedValue }));
  };

  const handleAddressChange = (key, value) => {
    setStudentData((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-md border border-red-100 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <User className="h-5 w-5 text-red-500 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={studentData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={!editing}
              />
            </div>
          </div>
          <div className="flex items-start">
            <User className="h-5 w-5 text-red-500 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Roll Number</p>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={studentData.roll_no || ""}
                onChange={(e) => handleChange("roll_no", e.target.value)}
                disabled={!editing}
              />
            </div>
          </div>
          <div className="flex items-start">
            <User className="h-5 w-5 text-red-500 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Stream</p>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={studentData.stream || ""}
                onChange={(e) => handleChange("stream", e.target.value)}
                disabled={!editing}
              />
            </div>
          </div>
          <div className="flex items-start">
            <User className="h-5 w-5 text-red-500 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                value={studentData.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
                disabled={!editing}
              />
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-red-500 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <input
              type="email"
              className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.email_id || ""}
              onChange={(e) => handleChange("email_id", e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-red-500 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.phone_no[0] || ""}
              onChange={(e) => handleChange("phone_no", [e.target.value])}
              disabled={!editing}
            />
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-red-500 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Street</p>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.address.street || ""}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-red-500 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">City</p>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.address.city || ""}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-red-500 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">State</p>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.address.state || ""}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-red-500 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">District</p>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.address.district || ""}
              onChange={(e) => handleAddressChange("district", e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-red-500 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Pin Code</p>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={studentData.address.pin_code || ""}
              onChange={(e) => handleAddressChange("pin_code", e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsTab;
