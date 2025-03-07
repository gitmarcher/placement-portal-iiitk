import React from "react";
import { logo } from "../assets";
import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="py-6 px-6 shadow-md bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Back button */}
          <Link to="/dashboard" className="text-gray-500 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          
          {/* Logo and title */}
          <Link to="/dashboard" className="flex items-center gap-x-2">
            <img src={logo} alt="Logo" className="h-8" />
            <h1 className="text-gray-900 font-medium text-lg">
              Placement Portal
            </h1>
          </Link>
        </div>
        
        {/* Right side navigation */}
        
      </div>
    </nav>
  );
};

export default Navbar;