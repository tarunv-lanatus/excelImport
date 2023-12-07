import { useMemo, useState } from "react";
import excelContext from "./excelContext";

export const ContextProvider = (props) => {
  const [listOfAllUsers] = useState([
    "Jay Parmar",
    "Shete Roshan",
    "Hariom Dubey",
    "Priyanka Prajapati",
    "Keyur Sachaniya",
    "Ajay Dhandhukiya",
    "Riddhi Makwana",
    "Nikki  Bakshi",
  ]);
  const [namesInFile, setNamesInFile] = useState([]);
  const [missingUsers, setMissingUsers] = useState([]);
  const [HoursOfUsers, setHoursOfUsers] = useState([]);

  return (
    <excelContext.Provider
      value={{
        listOfAllUsers,
        namesInFile,
        setNamesInFile,
        missingUsers,
        setMissingUsers,
        HoursOfUsers,
        setHoursOfUsers,
      }}
    >
      {props.children}
    </excelContext.Provider>
  );
};
