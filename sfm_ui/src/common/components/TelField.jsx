import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useTextFieldStyles } from "../styles/useTextFieldStyle";

const TelField = ({ props }) => {
  const { textFieldStyles } = useTextFieldStyles(); // Use the styles
  const [value, setValue] = useState(props.value);
  const handleChange = (e) => {
    const value = e.target.value;
    setValue(value);
    if (props.onChange) props.onChange(props.fieldName, e.target.value);
  };

  return (
    <TextField
      label={props.label}
      type="tel"
      value={value}
      required={props.required || false}
      placeholder={props.placeholder || ""}
      disabled={props.readOnly || false}
      fullWidth
      variant="standard"
      onChange={handleChange}
      sx={textFieldStyles} // Apply styles from the custom hook
      error={props.error} // Convert error message to boolean
      helperText={props.helperText} // Show error message if exists
    />
  );
};

export default TelField;
