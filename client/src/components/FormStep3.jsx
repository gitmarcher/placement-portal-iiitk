// src/components/FormStep3.js (Professional Details)
import React from "react";

const FormStep3 = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6 text-black font-ubuntu">
        Professional Details
      </h2>
      <div className="mb-4">
        <textarea
          className="appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 resize-none"
          name="work_experience"
          value={formData.work_experience} // No join, treat as string
          onChange={handleChange} // Use regular handleChange
          placeholder="Work Experience (e.g., Intern at XYZ Pvt Ltd, Freelance Web Developer)"
          rows="2"
        />
      </div>
      <div className="mb-4">
        <textarea
          className="appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 resize-none"
          name="additional_skills"
          value={formData.additional_skills} // No join, treat as string
          onChange={handleChange} // Use regular handleChange
          placeholder="Additional Skills (e.g., React, Node.js, Python, MongoDB)"
          rows="2"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="digital_locker"
          value={formData.digital_locker}
          onChange={handleChange}
          type="url"
          placeholder="Digital Locker URL (e.g., https://locker.example.com/sameer-khan)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="resume_link"
          value={formData.resume_link}
          onChange={handleChange}
          type="url"
          placeholder="Resume Link (e.g., https://drive.google.com/your-resume)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="linkedin_profile"
          value={formData.linkedin_profile}
          onChange={handleChange}
          type="url"
          placeholder="LinkedIn Profile (e.g., https://linkedin.com/in/your-profile)"
        />
      </div>
      <div className="mb-4">
        <input
          className="appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          name="github_profile"
          value={formData.github_profile}
          onChange={handleChange}
          type="url"
          placeholder="GitHub Profile (e.g., https://github.com/your-username)"
        />
      </div>
    </div>
  );
};

export default FormStep3;
