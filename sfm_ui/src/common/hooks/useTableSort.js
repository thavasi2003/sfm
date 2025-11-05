import { useState } from "react";

export const useTableSort = (defaultOrderBy, defaultOrder = "asc") => {
  const [order, setOrder] = useState(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const aValue = a[orderBy] ?? "";
      const bValue = b[orderBy] ?? "";
      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  return { order, orderBy, handleSort, sortData };
};

export function usePagination(defaultRowsPerPage) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return { page, rowsPerPage, handlePageChange, handleRowsPerPageChange };
}

export function useSearch(filterFunction) {
  const [query, setQuery] = useState("");

  const handleSearch = (query) => {
    setQuery(query);
  };

  const filterData = (data) => {
    return data.filter((item) => filterFunction(item, query));
  };

  return { query, handleSearch, filterData };
}
