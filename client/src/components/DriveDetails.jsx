import React, { useState } from "react";
import { EditorState } from "draft-js";
import { toast } from "react-toastify";
import addDrive from "../API/addDrive";
import DriveBasicDetails from "./DriveBasicDetails";
import AboutWorkSection from "./AboutWorkSection";
import EligibilitySection from "./EligibilitySection";
import RoundsSection from "./RoundsSection";
import RequiredDetailsSection from "./RequiredDetailsSection";

const DriveDetails = () => {
  // Initialize state with formData, including criteria.stream as an empty array
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
      stream: [], // Ensures stream is an array for checkbox handling
      work_experience_count: ""
    },
    required_details: []
  });

  // Handle text input changes
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

  // Handle checkbox changes for streams
  const handleCheckboxChange = (name, value) => {
    setFormData((prevData) => {
      const currentValues = prevData.criteria[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value) // Remove if already selected
        : [...currentValues, value]; // Add if not selected
      return {
        ...prevData,
        criteria: { ...prevData.criteria, [name]: newValues }
      };
    });
  };

  // Handle required details checkbox changes
  const handleRequiredDetailsChange = (value) => {
    setFormData((prev) => {
      const current = prev.required_details || [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value) // Remove if present
        : [...current, value]; // Add if absent
      return { ...prev, required_details: newValues };
    });
  };

  // Handle rounds updates
  const handleRoundChange = (rounds) => {
    setFormData((prevData) => ({ ...prevData, rounds }));
  };

  // Handle form submission
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
    <div className="max-w-4xl mx-auto bg-[#FDE6E6] rounded-xl shadow-lg my-10 p-8 font-ubuntu">
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-8">
        Create Drive
      </h1>
      <form onSubmit={handleSubmit}>
        <DriveBasicDetails formData={formData} handleChange={handleChange} />
        <hr className="w-full mx-auto border-0 h-px my-6 bg-[#DDDDDD]" />
        <AboutWorkSection
          editorState={editorState}
          setEditorState={setEditorState}
        />
        <hr className="w-full mx-auto border-0 h-px my-6 bg-[#DDDDDD]" />
        <EligibilitySection
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange} // Pass handler for streams
        />
        <hr className="w-full mx-auto border-0 h-px my-6 bg-[#DDDDDD]" />
        <RequiredDetailsSection
          formData={formData}
          handleCheckboxChange={handleRequiredDetailsChange}
        />
        <hr className="w-full mx-auto border-0 h-px my-6 bg-[#DDDDDD]" />
        <RoundsSection formData={formData} setRounds={handleRoundChange} />
        <div className="flex items-center justify-center mt-12">
          <button
            type="submit"
            className="bg-[#EB3030] text-white font-medium rounded-lg px-8 py-3 transition-colors duration-200 hover:bg-[#D00000] focus:outline-none focus:ring-2 focus:ring-[#EB3030] focus:ring-offset-2"
          >
            Create Drive
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriveDetails;
