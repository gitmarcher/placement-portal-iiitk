// src/components/FormStep2.js (Academic Details)
import React from "react";

const FormStep2 = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      academics: { ...formData.academics, [name]: value }
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6 text-black font-ubuntu">
        Academic Details
      </h2>

      {/* Warning Message */}
      <div className="mb-6 px-3 text-center text-sm text-red-600 font-ubuntu">
        <p>
          <strong>Important:</strong> Please ensure all academic details are
          accurate before submission. Once entered, this information cannot be
          modified later.
        </p>
      </div>

      <h3 className="text-xl font-normal text-left mb-4 px-3 pt-3 text-black font-ubuntu">
        10th Qualification
      </h3>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="tenth_board_name"
          value={formData.academics.tenth_board_name}
          onChange={handleChange}
          type="text"
          placeholder="10th Board (e.g., CBSE)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="tenth_percentage"
          value={formData.academics.tenth_percentage}
          onChange={handleChange}
          type="number"
          placeholder="10th Percentage (e.g., 95)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="tenth_passing_year"
          value={formData.academics.tenth_passing_year}
          onChange={handleChange}
          type="number"
          placeholder="10th Passing Year (e.g., 2018)"
        />
      </div>

      <h3 className="text-xl font-normal text-left mb-4 px-3 pt-3 text-black font-ubuntu">
        12th Qualification
      </h3>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="twelfth_board_name"
          value={formData.academics.twelfth_board_name}
          onChange={handleChange}
          type="text"
          placeholder="12th Board (e.g., CBSE)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="twelfth_percentage"
          value={formData.academics.twelfth_percentage}
          onChange={handleChange}
          type="number"
          placeholder="12th Percentage (e.g., 93)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="twelfth_passing_year"
          value={formData.academics.twelfth_passing_year}
          onChange={handleChange}
          type="number"
          placeholder="12th Passing Year (e.g., 2020)"
        />
      </div>

      <h3 className="text-xl font-normal text-left mb-4 px-3 pt-3 text-black font-ubuntu">
        Undergraduate Details
      </h3>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="graduation_degree"
          value={formData.academics.graduation_degree}
          onChange={handleChange}
          type="text"
          placeholder="Graduation Degree (e.g., B.Tech)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="cgpa"
          value={formData.academics.cgpa}
          onChange={handleChange}
          type="number"
          step="0.1"
          placeholder="CGPA (e.g., 9.5)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="graduation_year"
          value={formData.academics.graduation_year}
          onChange={handleChange}
          type="number"
          placeholder="Graduation Year (e.g., 2024)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="backlogs"
          value={formData.academics.backlogs}
          onChange={handleChange}
          type="number"
          placeholder="Number of Backlogs (e.g., 0)"
        />
      </div>
    </div>
  );
};

export default FormStep2;
