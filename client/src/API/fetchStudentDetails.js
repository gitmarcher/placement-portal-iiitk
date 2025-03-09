// src/api/student.js
import api from "./index";



// Fetch Student Details (GET request to /)
export const fetchStudentDetails = async () => {
  try {
    const response = await api.get("/student/profile", {
      withCredentials: true,  
    });
    const data = response.data;
    console.log("Success fetching student details:", data);
    return {
      success: true,
      data: {
        roll_no: data.roll_no,
        name: data.name,
        email_id: data.email_id,
        stream: data.stream,
        phone_no: data.phone_no,
        gender: data.gender,
        work_experience: data.work_experience,
        additional_skills: data.additional_skills,
        digital_locker: data.digital_locker,
        resume_link: data.resume_link,  
        linkedin_profile: data.linkedin_profile, 
        github_profile: data.github_profile,  
        address: data.address,
        academics: data.academics,
        applied_drives: data.applied_drives,
      },
    };
  } catch (error) {
    console.error("Error fetching student details:", error);
    return {
      success: false,
      message: error.response?.data || "Failed to fetch student details",
    };
  }
};