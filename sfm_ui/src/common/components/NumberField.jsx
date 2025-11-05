import React from "react";
import { TextField } from "@mui/material";
import { useTextFieldStyles } from "../styles/useTextFieldStyle";

const NumberField = ({ props }) => {
  const { textFieldStyles } = useTextFieldStyles(); // Use the styles

  return (
    <TextField
      label={props.label}
      type="number"
      placeholder={props.placeholder || ""}
      fullWidth
      required={props.required || false}
      disabled={props.readOnly || false}
      onChange={(e) => {
        if (props.onChange && props.fieldName)
          props.onChange(props.fieldName, e.target.value);
      }}
      sx={textFieldStyles} // Apply styles from the custom hook
      variant="standard"
      error={props.error} // Convert error message to boolean
      helperText={props.helperText} // Show error message if exists
    />
  );
};

export default NumberField;
