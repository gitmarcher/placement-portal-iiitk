import api from "./index";

const addDrive = async (driveDetails) => {
  try {
    const response = await api.post("/coord/drive/create", driveDetails);
    return response.data; // Return the response data (e.g., { message: 'Drive created successfully', drive: newDrive })
  } catch (error) {
    // Handle Axios error
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.error || "Failed to create drive");
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("No response from server");
    } else {
      // Error setting up the request
      throw new Error(error.message || "Error creating drive");
    }
  }
};

export default addDrive;