import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import React, { useContext, useEffect } from "react";
import readXlsxFile from "read-excel-file";
import excelContext from "../context/excelContext";
import { ReportOfHours } from "./ReportOfHours";

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
  const listUsersName = useContext(excelContext);

  const handleFileUpload = async (e) => {
    listUsersName.setNamesInFile([]);
    listUsersName.setMissingUsers([]);
    if (e.target.files[0]) {
      try {
        const nameList = [];
        await readXlsxFile(e.target.files[0]).then((rows) => {
          let tempName = [];
          for (let i = 1; i < rows.length; i++) {
            if (Date.parse(rows[i][0]) === Date.parse(rows[i - 1][0])) {
              if (
                rows[i][7] !== null &&
                rows[i][7] !== 0 &&
                typeof rows[i][7] !== "string"
              ) {
                tempName.push({ name: rows[i][3], hours: rows[i][7] });
                i === rows.length - 1 &&
                  nameList.push([
                    {
                      name: tempName.map((item) => item.name),
                      date: rows[i][0],
                      hours: tempName.map((item) => item.hours),
                    },
                  ]);
              }
            } else {
              if (i === 1) {
                if (
                  (rows[i][7] !== null && rows[i][7] !== 0) ||
                  typeof rows[i][7] !== "string"
                ) {
                  tempName.push({ name: rows[i][3], hours: rows[i][7] });
                }
                continue;
              }
              nameList.push([
                {
                  name: tempName.map((item) => item.name),
                  date: rows[i - 1][0],
                  hours: tempName.map((item) => item.hours),
                },
              ]);
              tempName = [];
              if (
                rows[i][7] !== null &&
                rows[i][7] !== 0 &&
                typeof rows[i][7] !== "string"
              ) {
                tempName.push({ name: rows[i][3], hours: rows[i][7] });
              }
            }
          }
        });
        listUsersName.setNamesInFile([...nameList]);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  useEffect(() => {
    if (listUsersName.namesInFile?.length) {
      for (let user of listUsersName.listOfAllUsers.data) {
        for (let item of listUsersName.namesInFile) {
          let userHasEntry = false;
          for (let data of item[0].name) {
            if (user.toLocaleLowerCase() === data.toLocaleLowerCase()) {
              userHasEntry = true;
              break;
            }
          }
          if (!userHasEntry) {
            listUsersName.missingUsers.push([
              { name: user, date: item[0].date },
            ]);
          }
        }
      }
      listUsersName.setMissingUsers([...listUsersName.missingUsers]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listUsersName?.namesInFile, listUsersName?.listOfAllUsers?.data]);

  return (
    <>
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
        {listUsersName.missingUsers.length > 0 ? (
          listUsersName.missingUsers.map((item) => {
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
      {listUsersName.namesInFile.length > 0 && <ReportOfHours />}
    </>
  );
};
