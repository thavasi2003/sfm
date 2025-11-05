import React from "react";
import { DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DialogFormTitle = ({ title, onClose }) => (
  <DialogTitle
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === "light"
          ? theme.palette.primary.main
          : theme.palette.primary.light,
      color: "#fff",
      mb: 1,
      py: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Typography sx={{ fontSize: 16 }}>{title}</Typography>

    <IconButton
      onClick={onClose}
      sx={{
        color: "#fff",
        padding: 0,
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
);

export default DialogFormTitle;
