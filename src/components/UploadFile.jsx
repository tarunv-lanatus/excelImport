import React, { useEffect, useState, useMemo } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import readXlsxFile from "read-excel-file";
import { Box } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const UploadFile = () => {
  const listOfUsers = useMemo(
    () => [
      "Jay Parmar",
      "Shete Roshan",
      "Hariom Dubey",
      "Priyanka Prajapati",
      "Keyur Sachaniya",
      "Ajay Dhandhukiya",
      "Riddhi Makwana",
      "Nikki  Bakshi",
    ],
    []
  );
  const [name, setName] = useState([]);
  const [missingUsers, setMissingUsers] = useState([]);

  const handleFileUpload = async (e) => {
    setName([]);
    setMissingUsers([]);
    if (e.target.files[0]) {
      try {
        const nameList = [];
        await readXlsxFile(e.target.files[0]).then((rows) => {
          let tempName = [];
          for (let i = 1; i < rows.length; i++) {
            if (Date.parse(rows[i][0]) === Date.parse(rows[i - 1][0])) {
              tempName.push(rows[i][3]);
              i === rows.length - 1 &&
                nameList.push([{ name: tempName, date: rows[i][0] }]);
            } else {
              if (i === 1) {
                tempName.push(rows[i][3]);
                continue;
              }
              nameList.push([
                {
                  name: tempName,
                  date: rows[i - 1][0],
                },
              ]);
              tempName = [];
              tempName.push(rows[i][3]);
            }
          }
        });
        setName([...nameList]);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  useEffect(() => {
    if (name.length) {
      for (let user of listOfUsers) {
        for (let item of name) {
          let userHasEntry = false;
          for (let data of item[0].name) {
            if (user.toLocaleLowerCase() === data.toLocaleLowerCase()) {
              userHasEntry = true;
              break;
            }
          }
          if (!userHasEntry) {
            missingUsers.push([{ name: user, date: item[0].date }]);
          }
        }
      }
      setMissingUsers([...missingUsers]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, listOfUsers]);

  return (
    <Box sx={{ justifyContent: "center", textAlign: "center" }}>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onChange={handleFileUpload}
      >
        Upload file
        <VisuallyHiddenInput type="file" accept=".xls, .xlsx" />
      </Button>
      {missingUsers.length > 0 ? (
        missingUsers.map((item) => {
          return (
            <p>
              {item[0].name} takes leave on the {item[0].date.toString()}.
            </p>
          );
        })
      ) : (
        <p>Please Upload File!!</p>
      )}
    </Box>
  );
};
