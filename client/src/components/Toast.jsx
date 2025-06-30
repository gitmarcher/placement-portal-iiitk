import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

// Custom Toast Content Component with Icons
const CustomToastContent = ({ type, message }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheck className="w-5 h-5" />;
      case "error":
        return <FiX className="w-5 h-5" />;
      case "warning":
        return <FiAlertCircle className="w-5 h-5" />;
      case "info":
        return <FiInfo className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
    </div>
  );
};

// Toast Service Functions
export const toastService = {
  success: (message) => {
    toast.success(<CustomToastContent type="success" message={message} />, {
      className: "toast-success",
      icon: false
    });
  },

  error: (message) => {
    toast.error(<CustomToastContent type="error" message={message} />, {
      className: "toast-error",
      icon: false
    });
  },

  warning: (message) => {
    toast.warning(<CustomToastContent type="warning" message={message} />, {
      className: "toast-warning",
      icon: false
    });
  },

  info: (message) => {
    toast.info(<CustomToastContent type="info" message={message} />, {
      className: "toast-info",
      icon: false
    });
  }
};

// Main Toast Container Component
const Toast = () => {
  return (
    <>
      {/* Custom CSS for toast styling */}
      <style jsx global>{`
        /* Top-center positioning and custom styling */
        .Toastify__toast-container {
          top: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: auto !important;
          max-width: 500px !important;
          min-width: 350px !important;
        }

        /* Base toast styling */
        .Toastify__toast {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          border: none !important;
          padding: 16px 20px !important;
          min-height: auto !important;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif !important;
        }

        /* Success toast */
        .toast-success.Toastify__toast--success {
          background: linear-gradient(
            135deg,
            #10b981 0%,
            #059669 100%
          ) !important;
          color: white !important;
        }

        /* Error toast */
        .toast-error.Toastify__toast--error {
          background: linear-gradient(
            135deg,
            #ef4444 0%,
            #dc2626 100%
          ) !important;
          color: white !important;
        }

        /* Warning toast */
        .toast-warning.Toastify__toast--warning {
          background: linear-gradient(
            135deg,
            #f59e0b 0%,
            #d97706 100%
          ) !important;
          color: white !important;
        }

        /* Info toast */
        .toast-info.Toastify__toast--info {
          background: linear-gradient(
            135deg,
            #3b82f6 0%,
            #2563eb 100%
          ) !important;
          color: white !important;
        }

        /* Hide default icons */
        .Toastify__toast-icon {
          display: none !important;
        }

        /* Hide progress bar */
        .Toastify__progress-bar {
          display: none !important;
        }

        /* Close button styling */
        .Toastify__close-button {
          color: rgba(255, 255, 255, 0.8) !important;
          font-size: 18px !important;
          padding: 0 !important;
          margin: 0 !important;
          align-self: flex-start !important;
        }

        .Toastify__close-button:hover {
          color: white !important;
        }

        /* Toast body */
        .Toastify__toast-body {
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .Toastify__toast-container {
            width: 90% !important;
            min-width: auto !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            top: 10px !important;
          }
        }
      `}</style>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        limit={3}
        toastClassName=""
        bodyClassName=""
        style={{}}
      />
    </>
  );
};

export default Toast;
