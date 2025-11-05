import { useState } from "react";

const useAlertSnackbar = () => {
  const [alertState, setAlertState] = useState({
    message: null,
    severity: "success",
  });

  const showAlert = (message, severity) => {
    setAlertState({ message, severity });
  };

  const hideAlert = () => {
    setAlertState({ message: null, severity: "success" });
  };

  return {
    alertState,
    showAlert,
    hideAlert,
  };
};

export default useAlertSnackbar;
