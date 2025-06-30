// src/api/auth.js (or wherever you keep API functions)
import api from "./index";

const completeProfile = async ( profileData) => {
  try {
    // Send PUT request to /api/userinfo with profile data
    const response = await api.post("/student/register/complete-profile", profileData, {
      // withCredentials: true is already set in api/index.js, so no need to repeat here
    });

    const data = response.data;

    // Handle successful profile completion
    return {
      success: true,
      message: data.message || "Profile completed successfully",
      student: data.student, // Include updated student data from backend
    };
  } catch (error) {
    console.error("Complete profile error:", error);

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return {
            success: false,
            message: data.error || "Invalid profile data",
          };
        case 401:
          return {
            success: false,
            message: "Unauthorized. Please log in again.",
          };
        case 404:
          return {
            success: false,
            message: "User not found",
          };
        case 500:
          return {
            success: false,
            message: "Server error. Please try again later.",
          };
        default:
          return {
            success: false,
            message: data.error || "An error occurred. Please try again.",
          };
      }
    } else if (error.request) {
      // No response received
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    } else {
      // Error setting up the request
      return {
        success: false,
        message: "An error occurred. Please try again.",
      };
    }
  }
};

export default completeProfile;