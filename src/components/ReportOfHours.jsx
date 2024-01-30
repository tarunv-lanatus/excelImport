import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import React, { useContext } from "react";
import excelContext from "../context/excelContext";
import { ExcelExport } from "./ExcelExport";

export const ReportOfHours = () => {
  const listUsersName = useContext(excelContext);
  let totalHours = 0;
  const columns = [
    {
      field: "rowLabels",
      headerName: "Row Labels",
      width: 150,
      editable: false,
    },
  ];

  let rows = [];
  const listOfDates = listUsersName.namesInFile?.map((item) => {
    if (item && item[0] && item[0].date) {
      return {
        field: `date ${item[0].date}`,
        headerName: new Date(item[0].date).toLocaleDateString("en-GB"),
        width: 150,
        editable: false,
        renderCell: (params) => {
          const valueOfHour = params.row[`date ${item[0].date}`];
          let backgroundColor = "";
          let width = "";
          let color = "";
          if (valueOfHour === 0) {
            backgroundColor = "red";
            width = 150;
            color = "white";
          } else if (valueOfHour === "on Leave") {
            backgroundColor = "green";
            width = 150;
            color = "white";
          }
          return (
            <div
              style={{
                backgroundColor,
                width,
                color,
                textAlign: "center",
              }}
            >
              {valueOfHour}
            </div>
          );
        },
      };
    }
    return null;
  });

  if (listOfDates?.length) {
    columns.push(...listOfDates);
  }
  columns.push({
    field: "Grand Total",
    headerName: "Grand Total",
    width: 150,
    editable: false,
  });

  const listForRows = listUsersName.listOfAllUsers?.data?.map((item, index) => {
    let totalOfHoursInRow = 0;
    const rowNames = {
      id: index,
      rowLabels: item,
    };

    listUsersName.namesInFile?.forEach((data) => {
      const dateFieldName = `date ${data[0].date}`;
      let valueOfHour = 0;
      const convertedDate =
        new Date(data[0].date).toISOString().split("T")[0] + "T00:00:00.000Z";

      const approvedItem =
        JSON.parse(localStorage.getItem("approvedItems")) || [];
      const matchingItem = approvedItem.find(
        (approved) => approved.date === convertedDate && approved.name === item
      );

      if (matchingItem) {
        valueOfHour = "on Leave";
      } else {
        const index = data[0].name.findIndex((name) => name === item);

        if (index !== -1) {
          if (!isNaN(parseFloat(data[0].hours[index]))) {
            valueOfHour = valueOfHour + parseFloat(data[0].hours[index]);
          } else {
            valueOfHour = "on Leave";
          }
        }
      }

      rowNames[dateFieldName] = valueOfHour;

      totalOfHoursInRow = Math.round(
        totalOfHoursInRow +
          (valueOfHour === "on Leave" ? 0.0 : parseFloat(valueOfHour))
      );
    });

    rowNames["Grand Total"] = totalOfHoursInRow;
    return rowNames;
  });

  if (listForRows?.length) {
    rows.push(...listForRows);
  }

  const lastRowForTotal = {
    id: rows.length,
    rowLabels: "Grand Total",
  };
  listUsersName.namesInFile?.forEach((data) => {
    let totalOfHoursInColumn = 0;
    for (let item in data[0].hours) {
      totalOfHoursInColumn = Math.round(
        totalOfHoursInColumn +
          (data[0].hours[item] === "on Leave" ? 0.0 : data[0].hours[item])
      );
    }
    lastRowForTotal[`date ${data[0].date}`] = totalOfHoursInColumn;
  });

  for (let item of rows) {
    totalHours = totalHours + item["Grand Total"];
  }

  lastRowForTotal["Grand Total"] = totalHours;

  rows.push(lastRowForTotal);

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
      <ExcelExport excelData={rows} fileName={"hour_report_list"} />
    </Box>
  );
};
