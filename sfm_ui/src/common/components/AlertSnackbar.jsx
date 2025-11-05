import { Snackbar, Alert } from "@mui/material";

const AlertSnackbar = (props) => {
  return (
    <Snackbar
      open={props.message !== null}
      autoHideDuration={3000}
      onClose={props.onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={props.onClose} severity={props.severity}>
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
