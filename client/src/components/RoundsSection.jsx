import React from "react";

const RoundsSection = ({ formData, handleChange }) => {
  return (
    <section className="mt-8 p-8">
      <p className="text-xl font-semibold">Rounds:</p>
      <div className="mt-[2rem]">
        <div className="flex items-center mb-4">
          <label htmlFor="round_number" className="w-40">
            Round Number:
          </label>
          <input
            type="text"
            name="round_number"
            id="round_number"
            className="w-full border-2 border-solid border-gray-300 p-1 rounded-md"
            value={formData.round_number}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="round_name" className="w-40">
            Round Name:
          </label>
          <input
            type="text"
            name="round_name"
            id="round_name"
            className="w-full border-2 border-solid border-gray-300 p-1 rounded-md"
            value={formData.round_name}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="description" className="w-40">
            Description:
          </label>
          <input
            type="text"
            name="description"
            id="description"
            className="w-full border-2 border-solid border-gray-300 p-1 rounded-md"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="selected_students" className="w-40">
            Selected Students:
          </label>
          <input
            type="text"
            name="selected_students"
            id="selected_students"
            className="w-full border-2 border-solid border-gray-300 p-1 rounded-md"
            value={formData.selected_students}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
};

export default RoundsSection;
