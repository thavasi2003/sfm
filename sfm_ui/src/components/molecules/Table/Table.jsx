import React, { useState } from 'react';
import './Table.css';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';

const Table = ({ data, headers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting logic
  const sortedData = () => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  // Handle sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter data based on search term
  const filteredData = () => {
    return sortedData().filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData().slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredData().length / rowsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SwapVertIcon sx={{fontSize:'20px',margin:'-4px 1px'}}/>;
    if (sortConfig.direction === 'ascending') return <ArrowDownwardIcon sx={{fontSize:'20px',margin:'-4px 1px'}} />;
    return <ArrowUpwardIcon sx={{fontSize:'20px',margin:'-4px 1px'}} />;
  };

  return (
    <div className="table-container">
      <div className="controls">
        <div className="rows-per-page">
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          {[10, 20, 50].map((size) => (

               <option key={size} value={size}>
                    {size} entries
                </option>
          ))}
          </select>
        </div>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <SearchIcon className="search-icon" />
        </div>
      </div>
      <table className='customtable'>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key}
              colSpan={header.colspan || 1}
              onClick={() => header.sortable && requestSort(header.key)}>
                <div className="header-content">
                  {header.label} {header.sortable && getSortIcon(header.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {headers.map(header => (
                  <td key={`${header.key}-${row.id || rowIndex}`} colSpan={header.colspan || 1}>
                    {header.renderer ? header.renderer(row) : row[header.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length}>
                <span className="no-data">No data available</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="pagination-controls">
        <div className="entries-info">
          Showing {filteredData().length === 0 ? '0' : indexOfFirstRow + 1 } - {Math.min(indexOfLastRow, filteredData().length)} of {filteredData().length} entries
        </div>
        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)} className={index + 1 === currentPage ? 'active' : ''}>
              {index + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Table;
