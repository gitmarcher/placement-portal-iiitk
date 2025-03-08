import api from "./index";

export const login = async (email, password, userType) => {
    try {
        // Use 'email' as 'username' since backend expects 'username'
        const response = await api.post("/auth/login", { 
            username: email, // Map email to username
            password, 
            userType 
        });
        
        const data = response.data;
        
        // Handle profile incomplete case (status 201)
        if (response.status === 201) {
            return {
                login: true,
                profileComplete: false,
                userId: data._id,
                username: data.username,
                userType: data.userType,
                message: data.message,
                // Store redirect URL if you want to handle redirection programmatically
                // redirectUrl: data.userType === 'student' ? '/complete-student-profile' : '/complete-profile'
            };
        }
        
        // Handle successful login with complete profile (status 200)
        return {
            login: true,
            profileComplete: true,
            userId: data._id,
            username: data.username,
            userType: data.userType,
            message: data.message || "Login successful"
        };
    } catch (error) {
        console.error("Login error:", error);
        
        // Handle different error scenarios
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    // Handle invalid credentials or invalid user type
                    return {
                        login: false,
                        message: data.error || "Invalid username or password"
                    };
                case 500:
                    return {
                        login: false,
                        message: "Server error. Please try again later."
                    };
                default:
                    return {
                        login: false,
                        message: data.error || "An error occurred. Please try again."
                    };
            }
        } else if (error.request) {
            // The request was made but no response was received
            return {
                login: false,
                message: "Network error. Please check your connection."
            };
        } else {
            // Something happened in setting up the request
            return {
                login: false,
                message: "An error occurred. Please try again."
            };
        }
    }
};

 