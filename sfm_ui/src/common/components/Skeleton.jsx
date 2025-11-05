import React from "react";
import { Box, Skeleton } from "@mui/material";

export const SkeletonLoad = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
    <Skeleton variant="text" width={200} height={40} />
    <Skeleton variant="rectangular" width="100%" height={300} />
  </Box>
);
