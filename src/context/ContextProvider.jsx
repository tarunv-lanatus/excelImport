import { useState, useMemo } from "react";
import excelContext from "./excelContext";

export const ContextProvider = (props) => {
  const listOfAllUsers = useMemo(
    () => JSON.parse(localStorage.getItem("users")),
    []
  );
  const [namesInFile, setNamesInFile] = useState([]);
  const [missingUsers, setMissingUsers] = useState([]);

  return (
    <excelContext.Provider
      value={{
        listOfAllUsers,
        namesInFile,
        setNamesInFile,
        missingUsers,
        setMissingUsers,
      }}
    >
      {props.children}
    </excelContext.Provider>
  );
};
