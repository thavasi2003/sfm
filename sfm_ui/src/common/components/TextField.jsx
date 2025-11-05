import React, { useState } from "react";
import { TextField as Input } from "@mui/material";
import { useTextFieldStyles } from "../styles/useTextFieldStyle";

const TextField = ({ props }) => {
  const { textFieldStyles } = useTextFieldStyles(); // Use the styles
  // Use state to track selected values
  const [selectedValue, setSelectedValue] = useState(props.value ?? "");
  const handleChange = (e) => {
    const value = e.target.value;

    setSelectedValue(value); // Update local state
    if (props.onChange && props.fieldName) {
      props.onChange(props.fieldName, value); // Pass updated value to the parent
    }
  };

  return (
    <Input
      label={props.label}
      placeholder={props.placeholder || ""}
      value={selectedValue}
      required={props.required || false}
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

export default TextField;
