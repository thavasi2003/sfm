import { styled, TableCell, TableRow, tableCellClasses } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    padding: "5px 20px",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: "5px 20px",
    textAlign: "center",
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hoverOpacity,
  },
}));

export const sortLabelStyles = {
  color: "inherit", // Keep text color the same
  "&:hover": {
    color: "inherit", // Prevent color change on hover
  },
  "&.Mui-active": {
    color: "inherit", // Prevent active text color change
  },
  "& .MuiTableSortLabel-icon": {
    color: "inherit", // Keep icon color the same
  },
  "&:hover .MuiTableSortLabel-icon": {
    color: "inherit", // Prevent icon color change on hover
  },
  "&.Mui-active .MuiTableSortLabel-icon": {
    color: "inherit", // Prevent icon color change when active
  },
  "&.Mui-active.Mui-desc .MuiTableSortLabel-icon": {
    color: "inherit", // Prevent icon color change when descending
  },
  "&.Mui-active.Mui-asc .MuiTableSortLabel-icon": {
    color: "inherit", // Prevent icon color change when ascending
  },
};
