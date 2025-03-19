import React, { useState } from "react";
import { EditorState } from "draft-js";
import { toast, ToastContainer } from "react-toastify";
import addDrive from "../API/addDrive";
import DriveBasicDetails from "./DriveBasicDetails";
import AboutWorkSection from "./AboutWorkSection";
import EligibilitySection from "./EligibilitySection";
import RoundsSection from "./RoundsSection";
import RequiredDetailsSection from "./RequiredDetailsSection";
import "react-toastify/dist/ReactToastify.css";

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
      tenth_percentage: "",
      twelfth_percentage: "",
      graduation_degree: "",
      graduation_year: "",
      cgpa: "",
      stream: [],
      work_experience_count: ""
    },
    required_details: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("criteria.")) {
      const criteriaField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        criteria: { ...prevData.criteria, [criteriaField]: value }
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prevData) => {
      const currentValues = prevData.criteria[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return {
        ...prevData,
        criteria: { ...prevData.criteria, [name]: newValues }
      };
    });
  };

  const handleRequiredDetailsChange = (value) => {
    setFormData((prev) => {
      const current = prev.required_details || [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, required_details: newValues };
    });
  };

  const handleRoundChange = (rounds) => {
    setFormData((prevData) => ({ ...prevData, rounds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const aboutText = editorState.getCurrentContent().getPlainText();
      const locationArray = formData.location
        .split(",")
        .map((loc) => loc.trim())
        .filter((loc) => loc);
      const graduationYearArray = formData.criteria.graduation_year
        .split(",")
        .map((year) => parseInt(year.trim(), 10))
        .filter((year) => !isNaN(year));
      const streamArray =
        formData.criteria.stream.length > 0
          ? formData.criteria.stream
          : ["ALL"];

      const payload = {
        drive_name: formData.drive_name,
        company_name: formData.company_name,
        company_logo: formData.company_logo,
        about: aboutText,
        type_of_role: formData.type_of_role,
        location: locationArray,
        ctc: formData.ctc,
        duration: formData.duration,
        number_of_positions: Number(formData.number_of_positions) || 0,
        deadline: formData.deadline,
        drive_date: formData.drive_date,
        rounds: formData.rounds.map((round) => ({
          round_number: Number(round.round_number) || 0,
          round_name: round.round_name,
          description: round.description
        })),
        criteria: {
          tenth_percentage:
            Number(formData.criteria.tenth_percentage) || undefined,
          twelfth_percentage:
            Number(formData.criteria.twelfth_percentage) || undefined,
          graduation_degree: formData.criteria.graduation_degree || undefined,
          graduation_year:
            graduationYearArray.length > 0 ? graduationYearArray : undefined,
          cgpa: Number(formData.criteria.cgpa) || undefined,
          stream: streamArray,
          work_experience_count:
            Number(formData.criteria.work_experience_count) || undefined
        },
        required_details: formData.required_details
      };

      console.log("Submitting payload:", payload);
      const res = await addDrive(payload);
      console.log("Response from addDrive:", res);
      if (res.message === "Drive created successfully") {
        toast.success("Drive created successfully");
      } else {
        toast.error(res.error || "Error creating drive");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      if (err.message.includes("duplicate key")) {
        toast.error(
          `A drive with the name "${formData.drive_name}" already exists. Please use a different name.`
        );
      } else {
        toast.error(err.message || "Error creating drive");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 mb-16 bg-white rounded-2xl shadow-xl p-8 font-sans transition-all duration-300 hover:shadow-2xl">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
        Create a New Drive
      </h1>
      <form onSubmit={handleSubmit} className="space-y-10">
        <DriveBasicDetails formData={formData} handleChange={handleChange} />
        <hr className="border-t border-gray-200 my-8" />
        <AboutWorkSection
          editorState={editorState}
          setEditorState={setEditorState}
        />
        <hr className="border-t border-gray-200 my-8" />
        <EligibilitySection
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
        />
        <hr className="border-t border-gray-200 my-8" />
        <RequiredDetailsSection
          formData={formData}
          handleCheckboxChange={handleRequiredDetailsChange}
        />
        <hr className="border-t border-gray-200 my-8" />
        <RoundsSection formData={formData} setRounds={handleRoundChange} />
        <div className="flex justify-center mt-12">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#EB3030] to-[#D00000] text-white font-semibold text-lg rounded-xl px-10 py-4 shadow-md hover:from-[#D00000] hover:to-[#B00000] focus:outline-none focus:ring-4 focus:ring-[#EB3030]/50 transition-all duration-200 transform hover:scale-105"
          >
            Create Drive
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriveDetails;
