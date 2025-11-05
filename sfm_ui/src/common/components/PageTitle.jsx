import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const PageTitle = ({ title }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography fontSize={18} fontWeight={600} color="black" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Divider color="primary" />
    </Box>
  );
};

export default PageTitle;
