import React, { createContext, useState } from "react";

const StudentCredContext = createContext();

const StudentCredProvider = ({ children }) => {
  const [studentCreds, setStudentCreds] = useState({
    creds: "",
    username: "",
    type: ""
  });

  const updateStudentCreds = (creds, username,type) => {
    setStudentCreds({ creds, username, type });
  };

  return (
    <StudentCredContext.Provider value={{ studentCreds, updateStudentCreds }}>
      {children}
    </StudentCredContext.Provider>
  );
};

export default StudentCredProvider;
export { StudentCredProvider, StudentCredContext };
