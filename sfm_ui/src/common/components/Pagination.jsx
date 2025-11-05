import React from "react";
import TablePagination from "@mui/material/TablePagination";

const Pagination = (props) => {
  return (
    <TablePagination
      rowsPerPageOptions={props.rowsPerPageOptions || [10, 20, 50]}
      component="div"
      count={props.count || 0}
      rowsPerPage={props.rowsPerPage || 20}
      page={props.page || 0}
      onPageChange={props.onPageChange}
      onRowsPerPageChange={props.onRowsPerPageChange}
    />
  );
};

export default Pagination;
