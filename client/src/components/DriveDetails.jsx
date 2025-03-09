import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "react-toastify";
import addDrive from "../API/addDrive";
import DriveBasicDetails from "./DriveBasicDetails";
import EmploymentTypeSection from "./EmploymentTypeSection";
import AboutWorkSection from "./AboutWorkSection";
import EligibilitySection from "./EligibilitySection";
import RequiredDataSection from "./RequiredDataSection";
import RoundsSection from "./RoundsSection";

const DriveDetails = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formData, setFormData] = useState({
    drive_name: "",
    company_name: "",
    company_logo: "",
    type_of_role: "",
    location: "",
    ctc: "",
    duration: "",
    number_of_positions: "",
    deadline: "",
    drive_date: "",
    rounds: [],
    criteria: {
      minimumCGPA: "",
      tenth_percentage: "",
      twelfth_percentage: "",
      graduation_degree: "",
      graduation_year: "",
      backlogs: "",
      yearSemester: [],
      stream: [],
      work_experience_count: ""
    },
    requiredData: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("criteria.")) {
      const criteriaField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        criteria: {
          ...prevData.criteria,
          [criteriaField]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prevData) => {
      let currentValues;
      if (name === "requiredData") {
        currentValues = prevData.requiredData || [];
      } else {
        currentValues = prevData.criteria[name] || [];
      }
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      if (name === "requiredData") {
        return { ...prevData, requiredData: newValues };
      }
      return {
        ...prevData,
        criteria: { ...prevData.criteria, [name]: newValues }
      };
    });
  };

  const handleRoundChange = (rounds) => {
    setFormData((prevData) => ({
      ...prevData,
      rounds
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const aboutText = editorState.getCurrentContent().getPlainText();
      const payload = {
        ...formData,
        about: aboutText,
        number_of_positions: Number(formData.number_of_positions) || 0,
        criteria: {
          ...formData.criteria,
          minimumCGPA: Number(formData.criteria.minimumCGPA) || 0,
          tenth_percentage: Number(formData.criteria.tenth_percentage) || 0,
          twelfth_percentage: Number(formData.criteria.twelfth_percentage) || 0,
          graduation_year: Array.isArray(formData.criteria.graduation_year)
            ? formData.criteria.graduation_year.map(Number)
            : [Number(formData.criteria.graduation_year)] || [],
          backlogs: Number(formData.criteria.backlogs) || 0,
          work_experience_count:
            Number(formData.criteria.work_experience_count) || 0
        }
      };
      console.log("Submitting payload:", JSON.stringify(payload, null, 2));
      const res = await addDrive(payload);
      if (res.message === "Drive created successfully") {
        toast.success("Drive created successfully");
      } else {
        toast.error(res.error || "Error creating drive");
      }
    } catch (err) {
      console.error("Error submitting form:", err.message);
      toast.error(err.message || "Error creating drive");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-lg my-10 p-8 font-ubuntu">
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-8">
        Create Drive
      </h1>
      <form onSubmit={handleSubmit}>
        <DriveBasicDetails formData={formData} handleChange={handleChange} />
        <hr className="w-full mx-auto border-0 h-px my-6 bg-gray-200" />
        <EmploymentTypeSection
          formData={formData}
          handleChange={handleChange}
        />
        <hr className="w-full mx-auto border-0 h-px my-6 bg-gray-200" />
        <AboutWorkSection
          editorState={editorState}
          setEditorState={setEditorState}
        />
        <hr className="w-full mx-auto border-0 h-px my-6 bg-gray-200" />
        <EligibilitySection
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
        />
        <hr className="w-full mx-auto border-0 h-px my-6 bg-gray-200" />
        <RequiredDataSection
          formData={formData}
          handleCheckboxChange={handleCheckboxChange}
        />
        <hr className="w-full mx-auto border-0 h-px my-6 bg-gray-200" />
        <RoundsSection formData={formData} setRounds={handleRoundChange} />
        <div className="flex items-center justify-center mt-12">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium rounded-lg px-8 py-3 transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Drive
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriveDetails;
