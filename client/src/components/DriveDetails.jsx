import React, { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { toastService } from "./Toast";
import addDrive from "../API/addDrive";
import DriveBasicDetails from "./DriveBasicDetails";
import AboutWorkSection from "./AboutWorkSection";
import EligibilitySection from "./EligibilitySection";
import RoundsSection from "./RoundsSection";
import RequiredDetailsSection from "./RequiredDetailsSection";
import CustomRequiredDetailsSection from "./CustomRequiredDetailsSection";
import CustomQuestionsSection from "./CustomQuestionsSection";
import JDFilesSection from "./JDFilesSection";

const DriveDetails = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [jdFiles, setJdFiles] = useState([]);
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
      work_experience_count: "",
      max_backlogs: "",
      eligible_batches: ""
    },
    required_details: [],
    custom_required_details: [],
    custom_questions: []
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

  const handleCustomFieldsChange = (customFields) => {
    setFormData((prev) => ({
      ...prev,
      custom_required_details: customFields
    }));
  };

  const handleCustomQuestionsChange = (customQuestions) => {
    setFormData((prev) => ({
      ...prev,
      custom_questions: customQuestions
    }));
  };

  const handleRoundChange = (rounds) => {
    setFormData((prevData) => ({ ...prevData, rounds }));
  };

  const handleJDFilesChange = (files) => {
    setJdFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert Draft.js content to HTML to preserve formatting
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      const aboutHtml = draftToHtml(rawContentState);

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
      const eligibleBatchesArray = formData.criteria.eligible_batches
        ? formData.criteria.eligible_batches
            .split(",")
            .map((batch) => parseInt(batch.trim(), 10))
            .filter((batch) => !isNaN(batch))
        : [];

      // Create FormData for multipart form submission
      const formDataToSend = new FormData();

      // Append regular form fields
      formDataToSend.append("drive_name", formData.drive_name);
      formDataToSend.append("company_name", formData.company_name);
      formDataToSend.append("company_logo", formData.company_logo);
      formDataToSend.append("about", aboutHtml);
      formDataToSend.append("type_of_role", formData.type_of_role);
      formDataToSend.append("location", JSON.stringify(locationArray));
      formDataToSend.append("ctc", formData.ctc);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append(
        "number_of_positions",
        Number(formData.number_of_positions) || 0
      );
      formDataToSend.append("deadline", formData.deadline);
      formDataToSend.append("drive_date", formData.drive_date);

      // Append rounds as JSON string
      const roundsData = formData.rounds.map((round) => ({
        round_number: Number(round.round_number) || 0,
        round_name: round.round_name,
        description: round.description
      }));
      formDataToSend.append("rounds", JSON.stringify(roundsData));

      // Append criteria as JSON string
      const criteriaData = {
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
          Number(formData.criteria.work_experience_count) || undefined,
        max_backlogs: Number(formData.criteria.max_backlogs) || undefined,
        eligible_batches:
          eligibleBatchesArray.length > 0 ? eligibleBatchesArray : undefined
      };
      formDataToSend.append("criteria", JSON.stringify(criteriaData));

      // Append other data as JSON strings
      formDataToSend.append(
        "required_details",
        JSON.stringify(formData.required_details)
      );
      formDataToSend.append(
        "custom_required_details",
        JSON.stringify(formData.custom_required_details || [])
      );
      formDataToSend.append(
        "custom_questions",
        JSON.stringify(formData.custom_questions || [])
      );

      // Append JD files
      jdFiles.forEach((file) => {
        formDataToSend.append("jd_files", file);
      });

      console.log("Submitting FormData with files:", jdFiles.length);

      // Update the API call to send FormData
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";
      const res = await fetch(`${backendUrl}/coordinator/drive/create`, {
        method: "POST",
        body: formDataToSend,
        credentials: "include" // This ensures cookies are sent
      });

      const responseData = await res.json();

      if (responseData.message === "Drive created successfully") {
        toastService.success(
          `Drive created successfully! ${
            responseData.uploaded_jd_files || 0
          } JD files uploaded.`
        );
        // Reset form
        setFormData({
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
            work_experience_count: "",
            max_backlogs: ""
          },
          required_details: [],
          custom_required_details: [],
          custom_questions: []
        });
        setJdFiles([]);
        setEditorState(EditorState.createEmpty());
      } else {
        toastService.error(responseData.error || "Failed to create drive");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      if (err.message.includes("duplicate key")) {
        toastService.error(
          `Drive "${formData.drive_name}" already exists. Please use a different name`
        );
      } else {
        toastService.error(err.message || "Failed to create drive");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 mb-16 bg-white rounded-2xl shadow-xl p-8 font-sans transition-all duration-300 hover:shadow-2xl">
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
        <CustomRequiredDetailsSection
          formData={formData}
          onCustomFieldsChange={handleCustomFieldsChange}
        />
        <hr className="border-t border-gray-200 my-8" />
        <CustomQuestionsSection
          formData={formData}
          onCustomQuestionsChange={handleCustomQuestionsChange}
        />
        <hr className="border-t border-gray-200 my-8" />
        <JDFilesSection onFilesChange={handleJDFilesChange} />
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
