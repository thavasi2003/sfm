import React from "react";
import TextField from "@mui/material/TextField";
import { useTextFieldStyles } from "../styles/useTextFieldStyle";

const TextAreaField = ({ props }) => {
  const { inputLabelStyles, textFieldStyles } = useTextFieldStyles(); // Use the styles

  return (
    <TextField
      label={props.label}
      placeholder={props.placeholder || ""}
      multiline
      maxRows={3}
      fullWidth
      disabled={props.readOnly || false}
      required={props.required || false}
      variant="outlined"
      onChange={(e) => {
        if (props.onChange && props.fieldName)
          props.onChange(props.fieldName, e.target.value);
      }}
      sx={textFieldStyles} // Apply styles from the custom hook
      InputLabelProps={{
        sx: inputLabelStyles,
      }}
      error={props.error} // Convert error message to boolean
      helperText={props.helperText} // Show error message if exists
    />
  );
};

export default TextAreaField;
