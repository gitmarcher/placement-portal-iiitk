import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const DriveDetails = () => {
  // State for Editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // State for form inputs
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    startDate: "",
    endDate: "",
    employmentType: "internship", // Default value for employment type
    location: "",
    duration: "",
    stipend: "",
    ppoOffered: false,
    CTC: "",
    locations: "",
    minimumCGPA: "",
    backlogs: "",
    yearSemester: [],
    stream: [],
    requiredData: [],
    logo: null
  });

  // Handle file input change for logo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        logo: URL.createObjectURL(e.target.files[0])
      });
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data: ", formData);
    // Here you would typically send the data to your API
  };

  // Reusable InputField component with improved styling
  const InputField = ({ label, type, name, id, className = "", disabled = false, ...rest }) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center mb-5">
        <label htmlFor={id} className="w-40 text-gray-700 font-medium mb-1 sm:mb-0">
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={id}
          className={`w-full border-2 border-solid border-gray-200 p-2.5 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 transition duration-200 text-gray-700 ${className}`}
          value={formData[name]} // Bind value to formData
          onChange={handleChange} // Handle input changes
          disabled={disabled}
          {...rest}
        />
      </div>
    );
  };

  const SectionHeader = ({ title, subtitle }) => (
    <div className="border-b border-gray-200 pb-3 mb-6">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="text-xs text-red-600 mt-1">{subtitle}</p>}
    </div>
  );
  
  

  const SectionOne = () => {
    return (
      <section className="mt-6 p-6 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <SectionHeader title="Drive Details" />
        <div className="flex flex-col justify-between sm:flex-row mt-6 gap-8">
          {/* Left form section */}
          <div className="w-full order-2 sm:w-3/4 mb-4 sm:mb-0">
            <InputField
              label="Company Name:"
              type="text"
              name="companyName"
              id="companyName"
              placeholder="Enter company name"
            />
            <InputField 
              label="Roles:" 
              type="text" 
              name="role" 
              id="role" 
              placeholder="e.g. Software Engineer, Data Analyst"
            />
            <div className="flex flex-col sm:flex-row gap-6 mb-4">
              <div className="flex-1">
                <InputField
                  label="Start Date:"
                  type="date"
                  name="startDate"
                  id="startDate"
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="End Date:"
                  type="date"
                  name="endDate"
                  id="endDate"
                />
              </div>
            </div>
          </div>

          {/* Right section with circular file input */}
          <div className="relative order-1 mb-4 flex flex-col items-center justify-center sm:order-2">
            <div className="relative rounded-full w-36 h-36 bg-gray-50 flex items-center justify-center border-2 border-dashed border-blue-300 overflow-hidden hover:border-blue-500 transition duration-300 group">
              {formData.logo ? (
                <>
                  <img src={formData.logo} alt="Company logo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white text-sm">Change Logo</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-gray-500 text-sm mt-2">Upload Logo</span>
                </div>
              )}
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <span className="mt-2 text-sm text-gray-500">Click to upload (PNG, JPG)</span>
          </div>
        </div>
      </section>
    );
  };

  const SectionTwo = () => {
    return (
      <section className="p-6 sm:p-8 bg-white rounded-xl shadow-sm mt-6 border border-gray-100">
        <SectionHeader title="Employment Type" />
        <div className="mt-6 flex flex-col sm:flex-row gap-8">
          {/* Internship Section */}
          <div className={`flex-1 p-5 rounded-xl border-2 transition-all duration-300 ${formData.employmentType === "internship" ? "border-blue-100 bg-blue-50 shadow-sm" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex gap-3 items-center mb-5">
              <input
                type="radio"
                name="employmentType"
                value="internship"
                id="internship-type"
                checked={formData.employmentType === "internship"}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-500 focus:ring-0 focus:ring-offset-0 border-gray-300 cursor-pointer"
              />
              <label htmlFor="internship-type" className="text-lg font-medium cursor-pointer">Internship</label>
            </div>
            <div className="pl-6 border-l-2 border-blue-200">
              <InputField
                label="Location:"
                type="text"
                name="location"
                id="location"
                placeholder="e.g. Remote, Bengaluru"
                disabled={formData.employmentType !== "internship"}
              />
              <InputField
                label="Duration:"
                type="text"
                name="duration"
                id="duration"
                placeholder="e.g. 3 months"
                disabled={formData.employmentType !== "internship"}
              />
              <InputField
                label="Stipend:"
                type="text"
                name="stipend"
                id="stipend"
                placeholder="e.g. ₹20,000 per month"
                disabled={formData.employmentType !== "internship"}
              />
              <div className="flex items-center gap-2 mb-5 mt-5">
                <label htmlFor="ppo-offered" className="w-40 text-gray-700 font-medium">PPO:</label>
                <div className="flex items-center">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox"
                      id="ppo-offered"
                      name="ppoOffered"
                      checked={formData.ppoOffered}
                      onChange={handleChange}
                      className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-blue-500 transition-all duration-200"
                      disabled={formData.employmentType !== "internship"}
                    />
                    <label 
                      htmlFor="ppo-offered" 
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${formData.ppoOffered ? 'bg-blue-300' : 'bg-gray-300'}`}
                    ></label>
                  </div>
                  <label htmlFor="ppo-offered" className="text-sm">Pre-Placement Offer Available</label>
                </div>
              </div>
              <div className={`mt-2 transition-opacity duration-300 ${formData.ppoOffered && formData.employmentType === "internship" ? 'opacity-100' : 'opacity-50'}`}>
                <InputField
                  label="CTC:"
                  type="text"
                  name="CTC"
                  id="CTC-intern"
                  placeholder="e.g. ₹8 LPA"
                  disabled={!formData.ppoOffered || formData.employmentType !== "internship"}
                />
                <InputField
                  label="Location(s):"
                  type="text"
                  name="locations"
                  id="locations-intern"
                  placeholder="e.g. Bengaluru, Hyderabad"
                  disabled={!formData.ppoOffered || formData.employmentType !== "internship"}
                />
              </div>
            </div>
          </div>

          {/* Full Time Section */}
          <div className={`flex-1 p-5 rounded-xl border-2 transition-all duration-300 ${formData.employmentType === "fulltime" ? "border-blue-100 bg-blue-50 shadow-sm" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex gap-3 items-center mb-5">
              <input
                type="radio"
                name="employmentType"
                id="fulltime-type"
                value="fulltime"
                checked={formData.employmentType === "fulltime"}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-500 focus:ring-0 focus:ring-offset-0 border-gray-300 cursor-pointer"
              />
              <label htmlFor="fulltime-type" className="text-lg font-medium cursor-pointer">Full Time</label>
            </div>
            <div className="pl-6 border-l-2 border-blue-200">
              <InputField
                label="CTC:"
                type="text"
                name="CTC"
                id="CTC-fulltime"
                placeholder="e.g. ₹12 LPA"
                disabled={formData.employmentType !== "fulltime"}
              />
              <InputField
                label="Location(s):"
                type="text"
                name="locations"
                id="locations-fulltime"
                placeholder="e.g. Bengaluru, Hyderabad"
                disabled={formData.employmentType !== "fulltime"}
              />
            </div>
          </div>
        </div>
      </section>
    );
  };

  const SectionThree = () => {
    return (
      <section className="p-6 sm:p-8 bg-white rounded-xl shadow-sm mt-6 border border-gray-100">
        <SectionHeader title="About Work" />
        <div className="mt-4">
          <div className="mb-3 flex items-center">
            <span className="text-sm text-gray-600 mr-3">Describe the work, responsibilities, tech stack, etc.</span>
            <div className="bg-blue-100 text-xs text-blue-800 px-3 py-1 rounded-full">Rich Text Editor</div>
          </div>
          <div className="border border-gray-300 rounded-xl overflow-hidden">
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              wrapperClassName="w-full"
              editorClassName="px-4"
              toolbarClassName="border-0 border-b border-gray-200"
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "list",
                  "textAlign",
                  "link",
                  "history"
                ],
                inline: { options: ["bold", "italic", "underline"] },
                blockType: {
                  options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"]
                },
                list: { options: ["unordered", "ordered"] }
              }}
              placeholder="Start typing here..."
              editorStyle={{
                height: "20rem",
                overflow: "auto",
                padding: "16px",
                backgroundColor: "white"
              }}
            />
          </div>
        </div>
      </section>
    );
  };

  const CheckBox = ({ label, name, options, columns = 1 }) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-start mb-6">
        {label && (
          <label className="w-40 mr-6 mb-2 sm:mb-0 text-gray-700 font-medium">{label}</label>
        )}
        <div className={`flex-1 grid grid-cols-1 sm:grid-cols-${Math.min(columns, 2)} md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns} gap-x-6 gap-y-3`}>
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  id={`${name}-${index}`}
                  name={name}
                  value={option.value}
                  className="peer h-5 w-5 accent-blue-500 cursor-pointer rounded border-gray-300"
                  checked={formData[name].includes(option.value)}
                  onChange={() => handleCheckboxChange(name, option.value)}
                />
                <div className="absolute w-5 h-5 rounded border border-gray-300 pointer-events-none peer-checked:border-blue-500 peer-checked:bg-blue-500"></div>
                {formData[name].includes(option.value) && (
                  <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </div>
              <label htmlFor={`${name}-${index}`} className="ml-2 cursor-pointer text-gray-700 select-none">{option.label}</label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const yearSemesterOptions = [
    { value: "1st", label: "1st year (SEM I-II)" },
    { value: "2nd", label: "2nd year (SEM III-IV)" },
    { value: "3rd", label: "3rd year (SEM V-VI)" },
    { value: "4th", label: "4th year (SEM VII-VIII)" }
  ];

  const stream = [
    { value: "CSE", label: "CSE" },
    { value: "CSY", label: "CSY" },
    { value: "AIDS", label: "AI-DS" },
    { value: "ECE", label: "ECE" }
  ];

  const requiredData = [
    { value: "name", label: "Name" },
    { value: "gender", label: "Gender" },
    { value: "roll", label: "Roll Number" },
    { value: "email", label: "Email Id" },
    { value: "personalEmail", label: "Personal Email Id" },
    { value: "cgpa", label: "CGPA" },
    { value: "backlogs", label: "Backlogs" },
    { value: "phone", label: "Phone Number" },
    { value: "resume", label: "Resume" },
    { value: "batch", label: "Batch" },
    { value: "branch", label: "Branch" },
    { value: "dob", label: "Date of Birth" },
    { value: "12th", label: "12th Percentage" },
    { value: "10th", label: "10th Percentage" },
    { value: "address", label: "Address" },
    { value: "skills", label: "Skills" },
    { value: "work", label: "Work Experience" },
    { value: "github", label: "Github Profile" },
    { value: "linkedin", label: "Linkedin Profile" },
    { value: "location", label: "Location Preference" }
  ];

  const SectionFour = () => {
    return (
      <section className="p-6 sm:p-8 bg-white rounded-xl shadow-sm mt-6 border border-gray-100">
        <SectionHeader title="Eligibility Criteria" />
        <div className="mt-4">
          <CheckBox
            label="Year/Semester:"
            name="yearSemester"
            options={yearSemesterOptions}
            columns={4}
          />
          <CheckBox 
            label="Stream:" 
            name="stream" 
            options={stream} 
            columns={4}
          />
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <InputField
                label="Minimum CGPA:"
                type="text"
                name="minimumCGPA"
                id="minimumCGPA"
                placeholder="e.g. 7.5"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Backlogs:"
                type="text"
                name="backlogs"
                id="backlogs"
                placeholder="e.g. No active backlogs allowed"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };

  const SectionFive = () => {
    return (
      <section className="p-6 sm:p-8 bg-white rounded-xl shadow-sm mt-6 border border-gray-100">
        <SectionHeader 
          title="Required Student Data" 
          subtitle="*Select items in order of their sheet placement" 
        />
        <div className="mt-4">
          <CheckBox 
            label="" 
            name="requiredData" 
            options={requiredData} 
            columns={4}
          />
        </div>

        {formData.requiredData.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100">
            <p className="text-sm font-medium text-blue-800 mb-3">Selected Fields (in order):</p>
            <div className="min-h-16 flex flex-wrap gap-2">
              {formData.requiredData.map((data, index) => (
                <div key={index} className="flex items-center bg-white text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 text-sm shadow-sm">
                  <span className="mr-1.5 bg-blue-100 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs">{index + 1}</span>
                  <span>{data}</span>
                  <button 
                    type="button"
                    className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                    onClick={() => handleCheckboxChange("requiredData", data)}
                    aria-label={`Remove ${data}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  // A floating helper component
  const FloatingHelper = () => (
    <div className="fixed bottom-6 right-6 bg-white rounded-full shadow-lg p-3 cursor-pointer hover:bg-blue-50 transition-colors group">
      <div className="absolute bottom-full right-0 mb-3 w-64 p-4 bg-white rounded-lg shadow-xl text-sm hidden group-hover:block">
        <h4 className="font-bold text-blue-600 mb-2">Need Help?</h4>
        <p className="text-gray-600">If you need assistance with creating a drive, click this button to access our help resources.</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-lg p-6 sm:p-8 my-10 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create New Drive</h1>
      <p className="text-center text-gray-500 mb-6">Fill in the details to create a new recruitment drive</p>
      
      {/* Progress bar tracking form completion */}
      
      
      <form onSubmit={handleSubmit}>
        <SectionOne />
        <SectionTwo />
        <SectionThree />
        <SectionFour />
        <SectionFive />
        
        <div className="flex items-center justify-between mx-4 my-8">
          <button 
            type="button"
            className="bg-white text-gray-700 border border-gray-300 rounded-lg px-6 py-3 font-medium transition duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 shadow-sm"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-8 py-3 font-medium transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md flex items-center"
          >
            <span>Create Drive</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
      
      
    </div>
  );
};

export default DriveDetails;