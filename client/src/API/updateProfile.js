import api from "./index";

const updateProfile = async (studentData) => {
    try {
        const response = await api.put("/student/profile", studentData);
        const data = response.data;
        console.log("Success updating student profile:", data);
        return {
        success: true,
        message: data.message || "Profile updated successfully",
        student: data.student,
        };
    } catch (error) {
        console.error("Error updating student profile:", error);
        return {
        success: false,
        message: error.response?.data || "Failed to update student profile",
        };
    }
    };

export default updateProfile;
