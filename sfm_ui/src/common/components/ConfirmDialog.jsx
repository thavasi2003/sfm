import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";

const ConfirmationDialog = ({ props }) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        id="dialog-title"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.primary.main
              : theme.palette.primary.light,
          color: "#fff", // White text color
          mb: 1,
          py: 1,
        }}
      >
        <Typography fontSize={16}>{props.title}</Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1">{props.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          onClick={props.onClose}
          color="secondary" // Secondary color for the "Cancel" button (default red)
          sx={{
            backgroundColor: "#e0e0e0", // Light grey background for the button
            color: "#000", // Black text color for the button
            "&:hover": {
              backgroundColor: "#c0c0c0", // Darker grey on hover
            },
          }}
        >
          <Typography fontSize={13}>{props.cancelButtonText}</Typography>
        </Button>
        <Button
          size="small"
          onClick={() => {
            if (props.onConfirm) props.onConfirm();
            if (props.onClose) props.onClose();
          }}
          color="primary" // Primary color for the "Save" button (default blue)
          sx={{
            backgroundColor: "#1976d2", // Custom blue background for the button
            color: "#fff", // White text color for the button
            "&:hover": {
              backgroundColor: "#1565c0", // Darker blue on hover
            },
          }}
        >
          <Typography fontSize={13}>{props.confirmButtonText}</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
