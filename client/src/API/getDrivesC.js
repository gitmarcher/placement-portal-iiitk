import api from "./index";

const getDrivesC = async (page = 1, limit = 10) => {
    try {
        const response = await api.get("/coord/drive/all", {
            params: { page, limit }, // Add pagination parameters
        });

        // Log raw response for debugging
        console.log('Raw drive data:', response.data);

        // Ensure response.data.drives is an array
        return {
            drives: Array.isArray(response.data.drives) ? response.data.drives : [],
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.currentPage || page, // Use requested page if not provided
            totalDrives: response.data.totalDrives || 0
        };
    } catch (error) {
        console.error('Error fetching drives:', error);
        console.error('Error response:', error.response?.data); // Log error details if available
        // Return a default structure on error
        return {
            drives: [],
            totalPages: 1,
            currentPage: page,
            totalDrives: 0
        };
    }
}
export { getDrivesC };
export default getDrivesC;