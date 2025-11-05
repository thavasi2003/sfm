import React from "react";
import { DialogActions, Button, Typography } from "@mui/material";

const DialogFormAction = ({ onCancel, cancelText, onSave, saveText }) => (
  <DialogActions>
    <Button
      onClick={onCancel}
      color="secondary"
      size="small"
      sx={{
        backgroundColor: "#e0e0e0",
        color: "#000",
        "&:hover": {
          backgroundColor: "#c0c0c0",
        },
      }}
    >
      <Typography sx={{ fontSize: 13 }}>{cancelText}</Typography>
    </Button>
    <Button
      onClick={onSave}
      color="primary"
      size="small"
      sx={{
        backgroundColor: "rgb(133, 110, 198)",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#c0c0c0",
        },
      }}
    >
      <Typography sx={{ fontSize: 13 }}>{saveText}</Typography>
    </Button>
  </DialogActions>
);

export default DialogFormAction;
