import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  TableSortLabel,
} from "@mui/material";
import Pagination from "./Pagination";
import {
  sortLabelStyles,
  StyledTableCell,
  StyledTableRow,
} from "../styles/StyledTable";
import React from "react";
import { NoDataFoundMessage } from "./NoDataFoundMessage";

const DataTable = ({
  data = [],
  columns = [],
  order,
  orderBy,
  page,
  rowsPerPage,
  onSort,
  onPageChange,
  onRowsPerPageChange,
  renderRow,
  status,
}) => {
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <React.Fragment>
      {status === "loading" ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height={400}
          sx={{ marginBottom: "20px" }}
        />
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              maxHeight: "calc(100vh - 252px)",
              "&::-webkit-scrollbar": { height: "5px", width: "5px" },
              "&::-webkit-scrollbar-track": { backgroundColor: "#D7D7D7" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#706f6f",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#505050",
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <StyledTableRow>
                  {columns.map((column) => (
                    <StyledTableCell key={String(column.key)}>
                      {column.sortable ? (
                        <TableSortLabel
                          active={orderBy === column.key}
                          direction={orderBy === column.key ? order : "asc"}
                          onClick={() => onSort(column.key)}
                          sx={sortLabelStyles}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => renderRow(row))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <NoDataFoundMessage />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </>
      )}
    </React.Fragment>
  );
};

export default DataTable;
