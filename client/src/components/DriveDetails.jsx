import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
// import createDrive from "../API/drive";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "react-toastify";

// Section Components
import DriveBasicDetails from "./DriveBasicDetails";
import EmploymentTypeSection from "./EmploymentTypeSection";
import AboutWorkSection from "./AboutWorkSection";
import EligibilitySection from "./EligibilitySection";
import RequiredDataSection from "./RequiredDataSection";
import RoundsSection from "./RoundsSection";

const DriveDetails = () => {
  // State for Editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // State for form inputs
  const [formData, setFormData] = useState({
    companyName: "",
    company_name: "",
    role: "",
    startDate: "",
    endDate: "",
    employmentType: "",
    location: "",
    duration: "",
    stipend: "",
    ppoOffered: false,
    CTC: "",
    locations: "",
    minimumCGPA: "",
    tenth_percentage: "",
    twelfth_percentage: "",
    graduation_degree: "",
    graduation_year: "",
    backlogs: "",
    yearSemester: [],
    stream: [],
    requiredData: [],
    round_number: "",
    round_name: "",
    description: "",
    selected_students: [],
    company_logo: "",
    work_experience_count: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prevData) => {
      const currentValues = prevData[name];
      if (currentValues.includes(value)) {
        return {
          ...prevData,
          [name]: currentValues.filter((v) => v !== value)
        };
      } else {
        return {
          ...prevData,
          [name]: [...currentValues, value]
        };
      }
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log(editorState.getCurrentContent().getPlainText());
  //     const res = await createDrive(
  //       formData,
  //       editorState.getCurrentContent().getPlainText()
  //     );
  //     if (res.success) {
  //       toast.success("Drive created successfully");
  //     } else {
  //       toast.error("Error creating drive");
  //     }
  //     console.log("Form submitted with data: ", formData);
  //   } catch (err) {
  //     console.error("Error submitting form: ", err);
  //     toast.error("Error creating drive");
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-lg my-10 p-8 font-ubuntu">
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-8">
        Create Drive
      </h1>
      <form>
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
          formData={formData} // Make sure to pass formData to AboutWorkSection
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
        {/* <hr className="w-full mx-auto border-0 h-px my-6 bg-gray-200" /> */}

        {/* <RoundsSection formData={formData} handleChange={handleChange} /> */}
      </form>
      <div className="flex items-center justify-center mt-12">
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium rounded-lg px-8 py-3 transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          // onClick={handleSubmit}
        >
          Create Drive
        </button>
      </div>
    </div>
  );
};

export default DriveDetails;
