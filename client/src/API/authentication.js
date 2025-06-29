// src/API/authentication.js
import api from "./index"; // Assuming this is your axios instance

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
            return {
                login: false,
                message: "Network error. Please check your connection."
            };
        } else {
            return {
                login: false,
                message: "An error occurred. Please try again."
            };
        }
    }
};

export const logout = async () => {
    try {
        const response = await api.post("/auth/logout");
        const data = response.data;
        
        return {
            success: response.status === 200,
            message: data.message || "Logged out successfully"
        };
    } catch (error) {
        console.error("Logout error:", error);
        
        if (error.response) {
            const { status, data } = error.response;
            return {
                success: false,
                message: data.error || "Logout failed"
            };
        }
        
        return {
            success: false,
            message: "An error occurred during logout"
        };
    }
};

// Helper function to check if error is authorization related (but not token expiry)
export const isAuthorizationError = (error) => {
    if (!error.response) return false;
    
    const { status, data } = error.response;
    
    // Check for role-based authorization errors (don't logout for these)
    if (status === 403 && data.code === "WRONG_ROLE") {
        return { shouldLogout: false, userRole: data.userRole };
    }
    
    // Check for authentication errors (should logout for these)
    if (status === 401 && (data.code === "NO_TOKEN" || data.code === "TOKEN_EXPIRED" || data.code === "INVALID_TOKEN")) {
        return { shouldLogout: true };
    }
    
    return false;
};