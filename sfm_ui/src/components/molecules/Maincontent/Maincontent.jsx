import React from "react";
import { Box } from "@mui/material";

const Maincontent = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%", // Always take full width
        transition: "margin 0.3s", // Smooth transition
        height: "calc(100vh - 50px)", // Adjust height to account for the header
        overflowY: "auto", // Allow scrolling within the main content
        background: "#F5F5F5", // Use theme's background color
      }}
    >
      <Box
        sx={{
          background: "#F5F5F5", // Use theme's background color
          // borderRadius: 2, // Rounded corners
          // boxShadow: 1, // Subtle shadow
          p: 1, // Padding for content
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Maincontent;
