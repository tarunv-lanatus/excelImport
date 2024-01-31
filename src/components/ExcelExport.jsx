import { Button, Tooltip } from "@mui/material";
import { saveAs } from "file-saver";
import XLSX from "xlsx-js-style";

export const ExcelExport = ({ excelData, fileName }) => {
  const adjustedExcelData = excelData.map((item, index) => ({
    ...item,
    id: index + 1,
  }));
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(adjustedExcelData, {
      cellStyles: true,
    });

    const styleForOnLeave = {
      fill: {
        fgColor: { rgb: "008000" },
      },
      font: {
        color: { rgb: "FFFFFF" },
      },
    };

    const styleForNull = {
      fill: {
        fgColor: { rgb: "ff0000" },
      },
      font: {
        color: { rgb: "FFFFFF" },
      },
    };

    XLSX.utils.sheet_to_json(ws, { header: 1 }).forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex,
          c: colIndex,
        });
        const cellData = ws[cellAddress];

        if (cell === "") {
          cellData.s = {
            fill: {
              fgColor: { rgb: "F6FF00" },
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
        if (cell === 0) {
          cellData.s = styleForNull;
        } else if (cell === "on Leave") {
          cellData.s = styleForOnLeave;
        }
      });
    });

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, fileName + fileExtension);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <Tooltip title="excel-report">
        <Button variant="contained" onClick={(e) => exportToExcel()}>
          Download
        </Button>
      </Tooltip>
    </div>
  );
};
