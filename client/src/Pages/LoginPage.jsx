// src/Pages/LoginPage.js
import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { login_img } from "../assets";
import { login } from "../API/authentication";
import { useNavigate } from "react-router-dom";
import { toastService } from "../components/Toast";
import { StudentCredContext } from "../contexts/StudentCredContext";

// LoginPage component handles user authentication
const LoginPage = () => {
  // State management
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { updateStudentCreds } = useContext(StudentCredContext);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation before submission
    if (!formData.username || !formData.password) {
      toastService.warning("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    toastService.info("Logging you in...");

    try {
      // Attempt login with provided credentials
      const response = await login(
        formData.username,
        formData.password,
        userType
      );

      console.log("res:", response);

      if (response.login) {
        // Store user credentials in context
        updateStudentCreds(response.userId, response.username, userType);

        console.log("Stored credentials:", {
          creds: response.userId,
          username: response.username,
          type: userType
        });

        // Route navigation based on user type and profile completion
        if (userType === "student") {
          console.log("pf:", response.profileComplete);
          if (!response.profileComplete) {
            console.log("hello");
            toastService.info("Profile completion required");
            navigate("/complete-profile");
          } else {
            toastService.success("Login successful! Welcome back");
            navigate("/dashboard");
          }
        } else if (userType === "coordinator") {
          toastService.success("Login successful! Welcome, Coordinator");
          navigate("/coordinator/dashboard");
        }
      } else {
        toastService.error(
          response.message || "Login failed. Please check your credentials"
        );
      }
    } catch (error) {
      // Handle login errors
      toastService.error("Login failed. Please try again later");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user type change with feedback
  const handleUserTypeChange = (type) => {
    setUserType(type);
    toastService.info(`Switched to ${type} login`);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Sticky Navigation Bar - Hidden on mobile */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Left Section - Login Form */}
        <div className="w-full mt-9 md:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">
              Welcome Back
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Select your account type
            </p>

            {/* User Type Selection Buttons */}
            <div className="flex rounded-md overflow-hidden mb-6 border border-gray-200 shadow-sm">
              <button
                type="button"
                className={`w-1/2 py-2 text-center font-medium transition-all duration-200 ${
                  userType === "student"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => handleUserTypeChange("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`w-1/2 py-2 text-center font-medium transition-all duration-200 ${
                  userType === "coordinator"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => handleUserTypeChange("coordinator")}
              >
                Coordinator
              </button>
            </div>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  placeholder={`${
                    userType === "student"
                      ? "20XXBCS00XX"
                      : "coordinator@example.com"
                  }`}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2.5 rounded-md font-medium hover:bg-red-400 transition-all duration-200 shadow-sm disabled:bg-red-300 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section - Login Image (Desktop only) */}
        <div className="hidden md:block md:w-1/2 bg-gray-50">
          <div className="h-full flex items-center justify-center p-8">
            <img
              src={login_img}
              alt="Login"
              className="max-w-full max-h-full object-contain rounded-md shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
