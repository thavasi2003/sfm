import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchField = ({ props }) => {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    if (props.onSearch) {
      props.onSearch(value);
    }
  };

  const handleClear = () => {
    setSearchText("");
    if (props.onSearch) {
      props.onSearch("");
    }
  };

  return (
    <TextField
      variant="outlined"
      placeholder="Search..."
      value={searchText}
      size="small"
      onChange={handleInputChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 16 }} />
          </InputAdornment>
        ),
        endAdornment: searchText && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear}>
              <ClearIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        borderRadius: 3,
        width: { xs: "70%", md: "30%" },
        maxWidth: { xs: "70%", md: "30%" },
        "& input::placeholder": {
          color: "gray", // Placeholder color
          opacity: 1, // Ensure full opacity
        },
        "& input": {
          color: "black", // Input text color
        },
      }}
    />
  );
};

export default SearchField;
