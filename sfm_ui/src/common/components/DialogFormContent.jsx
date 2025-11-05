import React from "react";
import { DialogContent, Box } from "@mui/material";

const DialogFormContent = ({ gap, sx, children }) => (
  <DialogContent sx={{ ...sx }}>
    <Box display="flex" flexDirection="column" gap={gap || 3}>
      {children}
    </Box>
  </DialogContent>
);

export default DialogFormContent;
