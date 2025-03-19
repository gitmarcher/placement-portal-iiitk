import api from "./index";

const addDrive = async (driveDetails) => {
  try {
    console.log("Sending drive details to API:", driveDetails); // Debug log
    const response = await api.post("/coord/drive/create", driveDetails);
    console.log("API response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error in addDrive:", error);
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to create drive");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message || "Error creating drive");
    }
  }
};

export default addDrive;