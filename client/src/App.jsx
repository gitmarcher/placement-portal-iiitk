import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../src/Pages/LoginPage";
import StudentDashboard from "./Pages/StudentDashboard";
import Profile from "../src/Pages/Profile";
import StudentDrive from "./Pages/StudentDrive";
import AddDrive from "./Pages/AddDrive";
import CoordinatorDrive from "./Pages/CoordinatorDrive";
import CoordinatorDashboard from "./Pages/CoordinatorDashboard";
import CompleteProfile from "./Pages/CompleteProfile";
import { StudentCredProvider } from "./contexts/StudentCredContext";
import { StudentDetailsProvider } from "./contexts/StudentDetailsContext";

const App = () => {
  return (
    <StudentDetailsProvider>
      <StudentCredProvider>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/drive/:id" element={<StudentDrive />} />
          <Route path="coordinator/add-drive" element={<AddDrive />} />
          <Route path="/coordinator/drive/:id" element={<CoordinatorDrive />} />
          <Route
            path="/coordinator/dashboard"
            element={<CoordinatorDashboard />}
          />
        </Routes>
      </StudentCredProvider>
    </StudentDetailsProvider>
  );
};

export default App;
