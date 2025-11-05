import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useTextFieldStyles } from "../styles/useTextFieldStyle";

const EmailField = ({ props }) => {
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [value, setValue] = useState(props.value);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setError(false);
      setHelperText("");
    } else {
      setError(true);
      setHelperText("Invalid email address");
    }
  };

  const { textFieldStyles } = useTextFieldStyles(); // Use the styles
  const handleChange = (e) => {
    const value = e.target.value;
    setValue(value);
    if (props.onChange) {
      props.onChange(props.fieldName, value);
    }
    validateEmail(value); // Validate on input change
  };

  return (
    <TextField
      label={props.label}
      fullWidth
      variant="standard"
      value={value}
      error={error || props.error}
      helperText={helperText || props.helperText}
      placeholder={props.placeholder || ""}
      required={props.required || false}
      disabled={props.readOnly || false}
      onChange={handleChange}
      sx={textFieldStyles} // Apply styles from the custom hook
    />
  );
};

export default EmailField;
