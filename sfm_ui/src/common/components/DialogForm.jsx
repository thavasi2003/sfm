import React from "react";
import { Dialog } from "@mui/material";

const DialogForm = ({ open, closeDialog, sx, children }) => (
  <Dialog
    open={open}
    fullWidth
    onClose={(_, reason) => {
      if (reason !== "backdropClick") {
        if (closeDialog) closeDialog(reason);
      }
    }}
    sx={{
      "& .MuiDialog-paper": {
        backgroundColor: "-moz-initial", // Set background color to secondary
        ...sx, // Merge with any additional styles passed via `sx`
      },
    }}
  >
    {children}
  </Dialog>
);

export default DialogForm;
