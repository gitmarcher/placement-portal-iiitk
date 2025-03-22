import Navbar from "../components/Navbar";
import DriveDetails from "../components/DriveDetails";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 
import { StudentCredContext } from "../contexts/StudentCredContext";
import { useContext,useEffect } from "react";
const AddDrive = () => {
  const { studentCreds } = useContext(StudentCredContext);
    const navigate = useNavigate();
    // Handle possible null or undefined studentCreds
      const { creds, type, username } = studentCreds?.creds || {};
      const userId = creds;
      const userType = type;
      
    console.log("CoordinatorDashboard - studentCreds:", userId, userType, username);
     useEffect(() => {
        console.log("CoordinatorDashboard - Checking authentication - studentCreds:", studentCreds);
        if (!studentCreds || !studentCreds.creds || !studentCreds.creds.creds) {
          console.log("No studentCreds found, redirecting to /login");
          toast.error("You must be logged in to access the dashboard.");
          navigate("/login", { replace: true });
          console.log(userId)
          return;
        }
        
        if (!userId) {
          console.log("No userId found, redirecting to /login");
          toast.error("You must be logged in to access the dashboard.");
          navigate("/login", { replace: true });
        } else if (userType !== "coordinator") {
          // console.log("User is not a student, redirecting to:", userType === "coordinator" ? "/coordinator/dashboard" : "/");
          toast.error("Only coordinator can access this dashboard.");
          navigate(userType === "coordinator" ? "/coordinator/dashboard" : "/", { replace: true });
        } else {
          console.log("User authenticated as coordinator, proceeding");
        }
      }, [studentCreds, userId, userType, navigate]);
  return (
    <div>
      {/* Updated the navbar wrapper to make it sticky */}
      <div className="sticky top-0 z-10 bg-white">
        <Navbar />
      </div>

      <div className="mt-0 flex w-[100vw] justify-center bg-slate-gray/20">
        <DriveDetails />
      </div>
    </div>
  );
};

export default AddDrive;
