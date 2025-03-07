import React, { useState } from "react";

export default function StudentDriveForm({ details, handleFormClick }) {
  const [formData, setFormData] = useState({
    fullName: "john Doe",
    email: "details.email",
    phone: "",
    cgpa: "details.cgpa",
    resumeLink: "",
    result10th: "details.result10th",
    result12th: "details.result12th",
    course: "details.course"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className=" right-0 border-gray-100  border-2 border-solid p-4 rounded-xl  mb-2 sm:mx-12">
      <div className=" flex gap-3  w-full  rounded-xl mt-2 mb-2">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-xl shadow-sm w-full border border-gray-200"
        >
          <div className="space-y-5">
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                Full name:
              </label>
              <input
                readOnly
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* College E-mail */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                College E-mail:
              </label>
              <input
                type="email"
                name="email"
                readOnly
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:bg-transparent "
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                Phone:
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* CGPA */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                CGPA:
              </label>
              <input
                type="text"
                name="cgpa"
                readOnly
                value={formData.cgpa}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* Resume Link */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                Resume link:
              </label>
              <input
                type="url"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* 10th Result */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                10th result:
              </label>
              <input
                type="text"
                name="result10th"
                readOnly
                value={`${formData.result12th}%`}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg  text-gray-500 focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* 12th Result */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                12th result:
              </label>
              <input
                type="text"
                name="result12th"
                readOnly
                value={`${formData.result12th}%`}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* Course */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                Course:
              </label>
              <input
                type="text"
                name="course"
                readOnly
                value={formData.course}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center mt-6 ">
              <button
                onClick={handleFormClick}
                className=" bg-custom-red hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg mr-4 "
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-black hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg "
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
