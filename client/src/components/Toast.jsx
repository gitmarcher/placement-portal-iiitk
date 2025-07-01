import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from "react-icons/fi";

// Simple Toast Service Functions
export const toastService = {
  success: (message) => {
    toast.success(
      <div className="flex items-center gap-3">
        <FiCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
        <span className="text-gray-800 text-sm font-medium">{message}</span>
      </div>,
      {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
        icon: false,
        position: "top-center"
      }
    );
  },

  error: (message) => {
    toast.error(
      <div className="flex items-center gap-3">
        <FiX className="w-4 h-4 text-red-600 flex-shrink-0" />
        <span className="text-gray-800 text-sm font-medium">{message}</span>
      </div>,
      {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
        icon: false,
        position: "top-center"
      }
    );
  },

  warning: (message) => {
    toast.warning(
      <div className="flex items-center gap-3">
        <FiAlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
        <span className="text-gray-800 text-sm font-medium">{message}</span>
      </div>,
      {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
        icon: false,
        position: "top-center"
      }
    );
  },

  info: (message) => {
    toast.info(
      <div className="flex items-center gap-3">
        <FiInfo className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-gray-800 text-sm font-medium">{message}</span>
      </div>,
      {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
        icon: false,
        position: "top-center"
      }
    );
  }
};

// Main Toast Container Component
const Toast = () => {
  return (
    <>
      {/* Minimal CSS styles */}
      <style>{`
        .Toastify__toast-container {
          top: 80px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: auto !important;
          max-width: 400px !important;
        }

        .Toastify__toast {
          background: white !important;
          border-radius: 8px !important;
          padding: 12px 16px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid #e5e7eb !important;
          margin-bottom: 8px !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        .Toastify__toast--success {
          border-left: 4px solid #10b981 !important;
        }

        .Toastify__toast--error {
          border-left: 4px solid #ef4444 !important;
        }

        .Toastify__toast--warning {
          border-left: 4px solid #f59e0b !important;
        }

        .Toastify__toast--info {
          border-left: 4px solid #3b82f6 !important;
        }

        .Toastify__toast-body {
          padding: 0 !important;
          margin: 0 !important;
          color: #374151 !important;
        }

        .Toastify__toast-icon {
          display: none !important;
        }
      `}</style>

      <ToastContainer
        position="top-center"
        newestOnTop={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        limit={3}
        theme="light"
      />
    </>
  );
};

export default Toast;
