import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import Navbar from "../components/Navbar";
import { toastService } from "../components/Toast";
import DriveBasicDetails from "../components/DriveBasicDetails";
import AboutWorkSection from "../components/AboutWorkSection";
import EligibilitySection from "../components/EligibilitySection";
import RoundsSection from "../components/RoundsSection";
import RequiredDetailsSection from "../components/RequiredDetailsSection";
import api from "../API/index";
import { StudentCredContext } from "../contexts/StudentCredContext";

const EditDrive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { studentCreds } = useContext(StudentCredContext);
  const [loading, setLoading] = useState(true);
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
      work_experience_count: "",
      max_backlogs: ""
    },
    required_details: []
  });

  // Load existing drive data
  useEffect(() => {
    const loadDriveData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/coordinator/drive/${id}`);
        const drive = response.data;

        // Convert date fields to YYYY-MM-DD format for input fields
        const formatDate = (dateString) => {
          if (!dateString) return "";
          return new Date(dateString).toISOString().split("T")[0];
        };

        setFormData({
          drive_name: drive.drive_name || "",
          company_name: drive.company_name || "",
          company_logo: drive.company_logo || "",
          type_of_role: drive.type_of_role || "",
          location: Array.isArray(drive.location)
            ? drive.location.join(", ")
            : drive.location || "",
          ctc: drive.ctc || "",
          duration: drive.duration || "",
          number_of_positions: drive.number_of_positions || "",
          deadline: formatDate(drive.deadline),
          drive_date: formatDate(drive.drive_date),
          rounds: drive.rounds || [],
          criteria: {
            tenth_percentage: drive.criteria?.tenth_percentage || "",
            twelfth_percentage: drive.criteria?.twelfth_percentage || "",
            graduation_degree: drive.criteria?.graduation_degree || "",
            graduation_year: drive.criteria?.graduation_year || "",
            cgpa: drive.criteria?.cgpa || "",
            stream: drive.criteria?.stream || [],
            work_experience_count: drive.criteria?.work_experience_count || "",
            max_backlogs: drive.criteria?.max_backlogs || ""
          },
          required_details: drive.required_details || []
        });

        // Set editor state for about section
        if (drive.about) {
          const blocksFromHTML = convertFromHTML(drive.about);
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (error) {
        console.error("Error loading drive data:", error);
        toastService.error("Failed to load drive data");
        navigate("/coordinator/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDriveData();
    }
  }, [id, navigate]);

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

  const handleRequiredDetailsChange = (name, value) => {
    setFormData((prevData) => {
      const currentValues = prevData.required_details || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return {
        ...prevData,
        required_details: newValues
      };
    });
  };

  const handleRoundChange = (rounds) => {
    setFormData((prevData) => ({
      ...prevData,
      rounds: rounds
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert location from string to array
      const locationArray = formData.location
        .split(",")
        .map((loc) => loc.trim())
        .filter((loc) => loc.length > 0);

      // Convert Draft.js content to HTML to preserve formatting
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      const aboutContent = draftToHtml(rawContentState);

      const submitData = {
        ...formData,
        location: locationArray,
        about: aboutContent,
        number_of_positions: parseInt(formData.number_of_positions),
        criteria: {
          ...formData.criteria,
          tenth_percentage: parseFloat(formData.criteria.tenth_percentage) || 0,
          twelfth_percentage:
            parseFloat(formData.criteria.twelfth_percentage) || 0,
          cgpa: parseFloat(formData.criteria.cgpa) || 0,
          work_experience_count:
            parseInt(formData.criteria.work_experience_count) || 0,
          max_backlogs: parseInt(formData.criteria.max_backlogs) || 0
        }
      };

      console.log("Submitting updated drive data:", submitData);

      const response = await api.put(`/coordinator/drive/${id}`, submitData);

      if (response.status === 200) {
        toastService.success("Drive updated successfully");
        navigate("/coordinator/dashboard");
      }
    } catch (err) {
      console.error("Error updating drive:", err);
      if (err.response?.data?.error?.includes("duplicate key")) {
        toastService.error(
          `Drive "${formData.drive_name}" already exists. Please use a different name`
        );
      } else {
        toastService.error(
          err.response?.data?.error || "Failed to update drive"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading drive data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white">
        <Navbar />
      </div>

      <div className="mt-0 flex w-[100vw] justify-center bg-slate-gray/20">
        <div className="max-w-5xl mx-auto mt-12 mb-16 bg-white rounded-2xl shadow-xl p-8 font-sans transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
            Edit Drive
          </h1>
          <form onSubmit={handleSubmit} className="space-y-10">
            <DriveBasicDetails
              formData={formData}
              handleChange={handleChange}
            />
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
            <div className="flex justify-center gap-4 mt-12">
              <button
                type="button"
                onClick={() => navigate("/coordinator/dashboard")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold text-lg rounded-xl px-10 py-4 shadow-md transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#EB3030] to-[#D00000] text-white font-semibold text-lg rounded-xl px-10 py-4 shadow-md hover:from-[#D00000] hover:to-[#B00000] focus:outline-none focus:ring-4 focus:ring-[#EB3030]/50 transition-all duration-200 transform hover:scale-105"
              >
                Update Drive
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDrive;
