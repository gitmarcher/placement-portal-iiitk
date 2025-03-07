// src/components/SignupPage.js
import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import FormStep1 from '../components/FormStep1';
import FormStep2 from '../components/FormStep2';
import FormStep3 from '../components/FormStep3';
import { signupbg,prev,next } from '../assets';
import { IoIosArrowRoundBack } from "react-icons/io";

const SignupPage = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
      setStep(step + 1);
  };

  const prevStep = () => {
      setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: `url(${signupbg})`, backgroundSize: '70%', backgroundRepeat: 'no-repeat' }}>
        {/* <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div> */}
      
      <div className="flex-grow flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 backdrop-blur-lg"></div>
        <div className="relative z-10 w-full max-w-lg mt-6 p-6 bg-white rounded-lg shadow-lg flex flex-col">
          <button
            className="absolute top-4 left-4 text-black p-2 rounded-full focus:outline-none focus:shadow-outline"
            // onClick={prevStep}
            // style={{ display: step > 1 ? 'block' : 'none' }}
          >
            <IoIosArrowRoundBack className="h-12 w-12" />
          </button>

          <div className="flex-grow">
            {step === 1 && <FormStep1 />}
            {step === 2 && <FormStep2 />}
            {step === 3 && <FormStep3 />}
          </div>

          <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
            className="p-2 rounded-full focus:outline-none absolute py-1 bottom-4 left-4"
            onClick={prevStep}
            >
              <img src={prev} alt="Back" className=" w-16" />
            </button>
          )}
            {step < 3 && (
              <button
              className="p-2 rounded-full focus:outline-none absolute py-1 bottom-4 right-4"
              onClick={nextStep}
              >
              <img src={next} alt="Back" className=" w-16" />
              </button>
            )}
          </div>

          {step === 3 && (
            <div className="flex justify-center mt-4">
              <button
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
