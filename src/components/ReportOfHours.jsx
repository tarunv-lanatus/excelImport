import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import React, { useContext } from "react";
import excelContext from "../context/excelContext";

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

  const rows = [];
  const listOfDates = listUsersName.namesInFile?.map((item) => {
    return {
      field: `date ${item[0].date}`,
      headerName: new Date(item[0].date).toLocaleDateString("en-GB"),
      width: 150,
      editable: false,
    };
  });

  columns.push(...listOfDates);
  columns.push({
    field: "totalOfRow",
    headerName: "Grand Total",
    width: 150,
    editable: false,
  });

  const listForRows = listUsersName.listOfAllUsers?.map((item, index) => {
    let totalOfHoursInRow = 0;
    const rowNames = {
      id: index,
      rowLabels: item,
    };
    listUsersName.namesInFile?.forEach((data) => {
      const dateFieldName = `date ${data[0].date}`;
      let valueOfhour = 0;
      for (let i = 0; i < data[0].name.length; i++) {
        if (item === data[0].name[i]) {
          valueOfhour = data[0].hours[i];
          break;
        } else {
          valueOfhour = 0;
        }
      }
      rowNames[dateFieldName] = valueOfhour === 0 ? "" : valueOfhour;
      totalOfHoursInRow = totalOfHoursInRow + valueOfhour;
    });
    rowNames["totalOfRow"] = totalOfHoursInRow;
    return rowNames;
  });

  rows.push(...listForRows);

  const lastRowForTotal = {
    id: rows.length,
    rowLabels: "Grand Total",
  };
  listUsersName.namesInFile?.forEach((data) => {
    let totalOfHoursInColumn = 0;
    for (let item in data[0].hours) {
      totalOfHoursInColumn = totalOfHoursInColumn + data[0].hours[item];
    }
    lastRowForTotal[`date ${data[0].date}`] = totalOfHoursInColumn;
  });

  for (let item of rows) {
    totalHours = totalHours + item.totalOfRow;
  }

  lastRowForTotal["totalOfRow"] = totalHours;
  rows.push(lastRowForTotal);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
