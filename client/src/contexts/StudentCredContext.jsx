import React, { createContext, useState } from "react";

const StudentCredContext = createContext();

const StudentCredProvider = ({ children }) => {
  const [studentCreds, setStudentCreds] = useState({
    creds: "",
    username: ""
  });

  const updateStudentCreds = (creds, username) => {
    setStudentCreds({ creds, username });
  };

  return (
    <StudentCredContext.Provider value={{ studentCreds, updateStudentCreds }}>
      {children}
    </StudentCredContext.Provider>
  );
};

export default StudentCredProvider;
export { StudentCredProvider, StudentCredContext };
