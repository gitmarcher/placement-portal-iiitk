import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { login_img, google } from "../assets";

const LoginPage = () => {
  const [userType, setUserType] = useState("student"); // Default to student login

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
            <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">Welcome Back</h1>
            <p className="text-center text-gray-500 mb-6">Select your account type</p>

            {/* User Type Selector */}
            <div className="flex rounded-md overflow-hidden mb-6 border border-gray-200 shadow-sm">
              <button
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

            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  placeholder={`${userType === "student" ? "student@example.com" : "coordinator@example.com"}`}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-800 focus:border-gray-800 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2.5 rounded-md font-medium hover:bg-red-400 transition-all duration-200 shadow-sm"
              >
                Login
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="px-3 text-gray-400 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <img src={google} alt="Google" className="w-4 h-4" />
                <span className="text-sm">Continue with Google</span>
              </button>

              <div className="text-center mt-4">
                <a href="#" className="text-gray-800 hover:text-gray-600 text-xs font-medium transition-all duration-200">
                  Forgot Password?
                </a>
              </div>
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
