// src/components/CompleteProfile.js
import React, { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import FormStep1 from "../components/FormStep1";
import FormStep2 from "../components/FormStep2";
import FormStep3 from "../components/FormStep3";
import { signupbg, prev, next } from "../assets";
import { IoIosArrowRoundBack } from "react-icons/io";
import completeProfile from "../API/completeProfile";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

// CompleteProfile component manages multi-step profile completion for students
const CompleteProfile = () => {
  // State management
  const [step, setStep] = useState(1); // Tracks current form step
  const [formData, setFormData] = useState({
    roll_no: "",
    name: "",
    email_id: "",
    stream: "",
    phone_no: [""],
    gender: "",
    work_experience: "",
    additional_skills: "",
    digital_locker: "",
    resume_link: "",
    linkedin_profile: "",
    github_profile: "",
    address: {
      street: "",
      city: "",
      state: "",
      district: "",
      pin_code: ""
    },
    academics: {
      cgpa: "",
      tenth_board_name: "",
      tenth_percentage: "",
      tenth_passing_year: "",
      twelfth_board_name: "",
      twelfth_percentage: "",
      twelfth_passing_year: "",
      graduation_degree: "",
      graduation_year: "",
      backlogs: ""
    }
  });

  // Hooks and context
  const { studentCreds } = useContext(StudentCredContext);
  const { creds: userId, type: userType, username } = studentCreds || {};
  

  const navigate = useNavigate();
  console.log("CompleteProfile - studentCreds:", userId, userType, username);
  // Authentication and role validation on component mount
  useEffect(() => {
    if (!userId) {
      toast.error("You must be logged in to complete your profile.");
      navigate("/login", { replace: true });
    } else if (userId.type !== "student") {
      toast.error("Only students can complete this profile.");
      navigate("/dashboard", { replace: true });
    }
  }, [userId.creds, userId.userType, navigate]);

  // Step navigation functions
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Form validation function
  const validateForm = () => {
    const topLevelFields = [
      { key: "roll_no", label: "Roll Number" },
      { key: "name", label: "Name" },
      { key: "email_id", label: "Email ID" },
      { key: "stream", label: "Stream" },
      { key: "phone_no", label: "Phone Number", isArray: true },
      { key: "gender", label: "Gender" },
      { key: "work_experience", label: "Work Experience", isArray: true },
      { key: "additional_skills", label: "Additional Skills", isArray: true },
      { key: "digital_locker", label: "Digital Locker" },
      { key: "resume_link", label: "Resume Link" },
      { key: "linkedin_profile", label: "LinkedIn Profile" },
      { key: "github_profile", label: "GitHub Profile" }
    ];

    // Validate top-level fields
    for (const field of topLevelFields) {
      if (field.isArray) {
        const value = field.key === "phone_no"
          ? formData[field.key]
          : formData[field.key].split(",").map((item) => item.trim());
        if (!value.length || value.every((item) => item === "")) {
          toast.error(`${field.label} cannot be empty.`);
          return false;
        }
      } else if (!formData[field.key]) {
        toast.error(`${field.label} cannot be empty.`);
        return false;
      }
    }

    // Validate address fields
    const addressFields = [
      { key: "street", label: "Street" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "district", label: "District" },
      { key: "pin_code", label: "Pin Code" }
    ];

    for (const field of addressFields) {
      if (!formData.address[field.key]) {
        toast.error(`Address: ${field.label} cannot be empty.`);
        return false;
      }
    }

    // Validate academic fields
    const academicsFields = [
      { key: "cgpa", label: "CGPA" },
      { key: "tenth_board_name", label: "10th Board Name" },
      { key: "tenth_percentage", label: "10th Percentage" },
      { key: "tenth_passing_year", label: "10th Passing Year" },
      { key: "twelfth_board_name", label: "12th Board Name" },
      { key: "twelfth_percentage", label: "12th Percentage" },
      { key: "twelfth_passing_year", label: "12th Passing Year" },
      { key: "graduation_degree", label: "Graduation Degree" },
      { key: "graduation_year", label: "Graduation Year" },
      { key: "backlogs", label: "Backlogs", allowZero: true }
    ];

    for (const field of academicsFields) {
      const value = formData.academics[field.key];
      if (field.allowZero) {
        if (value === undefined || value === null || value === "") {
          toast.error(`Academics: ${field.label} cannot be empty.`);
          return false;
        }
      } else if (!value) {
        toast.error(`Academics: ${field.label} cannot be empty.`);
        return false;
      }
    }

    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Transform data for API submission
      const transformedData = {
        ...formData,
        creds: userId,
        work_experience: formData.work_experience
          ? formData.work_experience.split(",").map((item) => item.trim())
          : [],
        additional_skills: formData.additional_skills
          ? formData.additional_skills.split(",").map((item) => item.trim())
          : []
      };
      
      const response = await completeProfile(transformedData);
      console.log("Form submitted:", transformedData);

      // Handle API response
      if (response.success) {
        navigate("/dashboard");
        toast.success("Profile completed successfully!");
        console.log("Profile completed successfully!");
      } else {
        console.error("Error completing profile:", response.message);
        toast.error(response.message || "Error completing profile");
      }
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: `url(${signupbg})`,
        backgroundSize: "70%",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Toast notifications container */}
      <ToastContainer />
      
      {/* Navigation bar */}
      <Navbar />
      
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center relative">
        {/* Background overlay effects */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 backdrop-blur-lg"></div>
        
        {/* Form container */}
        <div className="relative z-10 w-full max-w-lg mt-6 p-6 bg-white rounded-lg shadow-lg flex flex-col">
          {/* Back button */}
          <button className="absolute top-4 left-4 text-black p-2 rounded-full focus:outline-none focus:shadow-outline">
            <IoIosArrowRoundBack className="h-12 w-12" />
          </button>

          {/* Multi-step form */}
          <form onSubmit={handleSubmit} className="flex-grow">
            {step === 1 && (
              <FormStep1 formData={formData} setFormData={setFormData} />
            )}
            {step === 2 && (
              <FormStep2 formData={formData} setFormData={setFormData} />
            )}
            {step === 3 && (
              <FormStep3 formData={formData} setFormData={setFormData} />
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-[2rem]">
              {step > 1 && (
                <button
                  type="button"
                  className="p-2 rounded-full focus:outline-none absolute py-1 bottom-4 left-4"
                  onClick={prevStep}
                >
                  <img src={prev} alt="Back" className="w-16" />
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  className="p-2 rounded-full focus:outline-none absolute py-1 bottom-4 right-4"
                  onClick={nextStep}
                >
                  <img src={next} alt="Next" className="w-16" />
                </button>
              )}
            </div>

            {/* Submit button (final step) */}
            {step === 3 && (
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Register
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;