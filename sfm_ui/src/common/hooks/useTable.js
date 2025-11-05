import { usePagination, useSearch, useTableSort } from "./useTableSort";

export const useTable = (
  defaultOrderBy,
  defaultOrder = "asc",
  defaultRowsPerPage,
  filterFunction
) => {
  const { order, orderBy, handleSort, sortData } = useTableSort(
    defaultOrderBy,
    defaultOrder
  );
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange } =
    usePagination(defaultRowsPerPage);
  const { query, handleSearch, filterData } = useSearch(filterFunction);

  const processData = (data) => {
    const filteredData = filterData(data);
    const sortedData = sortData(filteredData);
    const paginatedData = sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return paginatedData;
  };

  return {
    order,
    orderBy,
    page,
    rowsPerPage,
    query,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    processData,
  };
};
