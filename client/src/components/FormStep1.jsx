// src/components/FormStep1.js (Personal Details)
import React from "react";

const FormStep1 = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Stream options for the dropdown
  const streamOptions = [
    { value: "", label: "Select Stream", disabled: true },
    { value: "CSE", label: "CSE" },
    { value: "CSE-AIDS", label: "CSE-AIDS" },
    { value: "CSE-CSY", label: "CSE-CSY" },
    { value: "ECE", label: "ECE" }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6 text-black font-ubuntu">
        Personal Details
      </h2>

      {/* Personal Information Section */}
      <h3 className="text-xl font-normal text-left mb-4 px-3 pt-3 text-black font-ubuntu">
        Basic Information
      </h3>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          placeholder="Full Name"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="roll_no"
          value={formData.roll_no}
          onChange={handleChange}
          type="text"
          placeholder="Roll Number (e.g., 2022BCS0082)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="email_id"
          value={formData.email_id}
          onChange={handleChange}
          type="email"
          placeholder="Email (e.g., sameer.khan@example.com)"
        />
      </div>
      <div className="mb-4">
        <select
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="stream"
          value={formData.stream}
          onChange={handleChange}
        >
          {streamOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          type="number"
          min="2020"
          max="2030"
          placeholder="Batch Year (e.g., 2022)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="phone_no[0]"
          value={formData.phone_no[0]}
          onChange={(e) =>
            setFormData({ ...formData, phone_no: [e.target.value] })
          }
          type="tel"
          placeholder="Phone Number (e.g., 9876543210)"
        />
      </div>
      <div className="mb-4">
        <select
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Address Section */}
      <h3 className="text-xl font-normal text-left mb-4 px-3 pt-3 text-black font-ubuntu">
        Address Details
      </h3>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="address.street"
          value={formData.address.street}
          onChange={handleChange}
          type="text"
          placeholder="Street Address (e.g., 123 Main Street)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="address.city"
          value={formData.address.city}
          onChange={handleChange}
          type="text"
          placeholder="City (e.g., New Delhi)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="address.district"
          value={formData.address.district}
          onChange={handleChange}
          type="text"
          placeholder="District (e.g., South Delhi)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="address.state"
          value={formData.address.state}
          onChange={handleChange}
          type="text"
          placeholder="State (e.g., Delhi)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="address.pin_code"
          value={formData.address.pin_code}
          onChange={handleChange}
          type="text"
          placeholder="Pin Code (e.g., 110001)"
        />
      </div>
    </div>
  );
};

export default FormStep1;
