import { createContext, useContext, useState, useEffect } from "react";

// Define the shape of the address object
const addressShape = {
  street: "",
  city: "",
  state: "",
  district: "",
  pin_code: ""
};

// Define the shape of the academics object
const academicsShape = {
  tenth_board_name: "",
  tenth_percentage: 0,
  tenth_passing_year: 0,
  twelfth_board_name: "",
  twelfth_percentage: 0,
  twelfth_passing_year: 0,
  graduation_degree: "B.Tech",
  graduation_year: 0,
  cgpa: 0,
  backlogs: 0
};

// Define the shape of an applied drive object
const appliedDrivesShape = {
  drive_id: "",
  application_date: new Date(),
  status: "Applied"
};

// Default student data structure
const defaultStudentData = {
  creds: "",
  roll_no: "",
  name: "",
  email_id: "",
  stream: "",
  phone_no: [],
  gender: "Male",
  work_experience: [],
  additional_skills: [],
  digital_locker: "",
  resume_link: "",
  linkedin_profile: "",
  github_profile: "",
  address: addressShape,
  academics: academicsShape,
  applied_drives: []
};

const StudentDetailsContext = createContext({
  studentData: defaultStudentData,
  setStudentData: () => {}
});

export const StudentDetailsProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(defaultStudentData);

  useEffect(() => {
    console.log("Context studentData updated:", studentData);
  }, [studentData]);

  return (
    <StudentDetailsContext.Provider value={{ studentData, setStudentData }}>
      {children}
    </StudentDetailsContext.Provider>
  );
};

export const useStudentDetails = () => {
  const context = useContext(StudentDetailsContext);
  if (!context) {
    throw new Error(
      "useStudentDetails must be used within a StudentDetailsProvider"
    );
  }
  return context;
};

export default StudentDetailsContext;
