import React from "react";
import { useNavigate } from "react-router-dom";
import { IoLockClosedOutline, IoArrowBackOutline } from "react-icons/io5";

const Unauthorized = ({ userRole, attemptedAccess }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    if (userRole === "student") {
      navigate("/dashboard");
    } else if (userRole === "coordinator") {
      navigate("/coordinator/dashboard");
    } else {
      navigate("/");
    }
  };

  const getCorrectDashboard = () => {
    if (userRole === "student") return "Student Dashboard";
    if (userRole === "coordinator") return "Coordinator Dashboard";
    return "Login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <IoLockClosedOutline className="mx-auto h-24 w-24 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Authorization Error
          </h3>
          <p className="text-gray-600 mb-4">
            {userRole ? (
              <>
                You are logged in as a{" "}
                <span className="font-semibold text-blue-600">{userRole}</span>,
                but this page requires different permissions.
              </>
            ) : (
              "You are not logged in or your session has expired."
            )}
          </p>
          {attemptedAccess && (
            <p className="text-sm text-gray-500">
              Attempted to access:{" "}
              <span className="font-mono">{attemptedAccess}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <IoArrowBackOutline className="mr-2 h-4 w-4" />
            Go Back
          </button>

          <button
            onClick={handleGoToDashboard}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to {getCorrectDashboard()}
          </button>
        </div>

        <div className="text-xs text-gray-500">
          If you believe this is an error, please contact your administrator.
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
