import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { login_img } from "../assets";
import { login } from "../API/authentication";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [userType, setUserType] = useState("student"); // Default to student login
  const [formData, setFormData] = useState({
    username: "", // Note: This will be sent as 'username' to the backend
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(
        formData.username,
        formData.password,
        userType
      );

      if (response.login) {
        // Store user data in localStorage or context for app-wide access
        localStorage.setItem(
          "userData",
          JSON.stringify({
            userId: response.userId,
            username: response.username,
            userType: response.userType
          })
        );

        // Check if profile is complete
        if (!response.profileComplete) {
          // Profile is incomplete, show message and redirect to profile completion
          toast.info(response.message);
          const completionRoute = userType === "student" ? "/signup" : "/";
          navigate(completionRoute);
        } else {
          // Profile is complete, proceed to dashboard
          toast.success(response.message || "Login successful!");
          navigate("/dashboard");
        }
      } else {
        // Login failed
        toast.error(response.message || "Authentication failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Sticky Navbar */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-col md:flex-row h-screen">
        {/* Left Side (Form) */}
        <div className="w-full mt-9 md:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">
              Welcome Back
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Select your account type
            </p>

            {/* User Type Selector */}
            <div className="flex rounded-md overflow-hidden mb-6 border border-gray-200 shadow-sm">
              <button
                type="button"
                className={`w-1/2 py-2 text-center font-medium transition-all duration-200 ${
                  userType === "student"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setUserType("student")}
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
                onClick={() => setUserType("coordinator")}
              >
                Coordinator
              </button>
            </div>

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

        {/* Right Side (Image) */}
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
