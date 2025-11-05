import { Button, Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useTable } from "../../common/hooks/useTable";
import DataTable from "../../common/components/DataTable";
import SearchField from "../../common/components/SearchField";
import {
  StyledTableRow,
  StyledTableCell,
} from "../../common/styles/StyledTable";
import AddIcon from "@mui/icons-material/Add";

const PartsTable = ({ partsData, onEdit, onDelete, loading, open }) => {
  // Filter function for search
  const filterFunction = (item, query) => {
    return (
      item.partname?.toLowerCase().includes(query.toLowerCase()) ||
      item.partsType?.toLowerCase().includes(query.toLowerCase()) ||
      false
    );
  };

  // Use table hook for sorting, pagination, and search
  const {
    order,
    orderBy,
    handleSort,
    processData,
    handleSearch,
    page,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
  } = useTable("partId", "asc", 10, filterFunction);

  const navigate = useNavigate();

  // Handle navigation (if needed)
  const handleNavigate = (template_type, type_id) => {
    switch (template_type) {
      case "TabView Template":
        navigate(`/tabviewtemplate`, { state: { type_id: type_id } });
        break;
      default:
        navigate("/template");
        break;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, overflowX: "auto" }}>
      {/* Search and Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
          gap: { xs: 2, sm: 2, md: 3 },
        }}
      >
        <SearchField onSearch={handleSearch} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => open(true)}
          sx={{
            width: "auto",
            maxWidth: "150px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AddIcon sx={{ fontSize: 19 }} />
          <Typography sx={{ fontSize: 13 }}> New </Typography>
        </Button>
      </Box>

      {/* DataTable */}
      <DataTable
        data={processData(partsData)}
        columns={[
          { key: "partId", label: "Part ID", sortable: true },
          { key: "partname", label: "Part Name", sortable: true },
          { key: "partsType", label: "Part Type", sortable: true },
          { key: "quantity", label: "Quantity", sortable: true },
          { key: "unitOfMeasure", label: "Unit of Measure", sortable: true },
          { key: "linkToAssetId", label: "Link To Asset_ID", sortable: true },
          { key: "locationZone", label: "Location Zone", sortable: true },
          { key: null, label: "Action" },
        ]}
        order={order}
        orderBy={orderBy}
        page={page}
        rowsPerPage={rowsPerPage}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        renderRow={(row) => (
          <StyledTableRow key={row.partId}>
            <StyledTableCell>{row.partId || ""}</StyledTableCell>
            <StyledTableCell>{row.partname || ""}</StyledTableCell>
            <StyledTableCell>{row.partsType || ""}</StyledTableCell>
            <StyledTableCell>{row.quantity || ""}</StyledTableCell>
            <StyledTableCell>{row.unitOfMeasure || ""}</StyledTableCell>
            <StyledTableCell>{row.linkToAssetId || ""}</StyledTableCell>
            <StyledTableCell>{row.locationZone || ""}</StyledTableCell>
            <StyledTableCell>
              {/* Edit Button */}
              <Button
                onClick={() => onEdit(row.partId)}
                size="small"
                aria-label="edit"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.primary.light
                      : theme.palette.text.primary,
                }}
              >
                <EditIcon />
              </Button>
              {/* Delete Button */}
              <Button
                onClick={() => onDelete(row.partId)}
                size="small"
                aria-label="delete"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.primary.light
                      : theme.palette.text.primary,
                }}
              >
                <DeleteIcon />
              </Button>
              {/* Preview Button */}
              <Button
                onClick={() => navigate(`/form/${row.partId}/preview`)}
                size="small"
                aria-label="preview"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.primary.light
                      : theme.palette.text.primary,
                }}
              >
                <VisibilityIcon />
              </Button>
            </StyledTableCell>
          </StyledTableRow>
        )}
        status={loading}
      />
    </Box>
  );
};

export default PartsTable;
