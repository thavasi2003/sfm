import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTextFieldStyles } from "../styles/useTextFieldStyle";

const PasswordField = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const { inputLabelStyles, textFieldStyles } = useTextFieldStyles(); // Use the styles

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      label={props.label}
      fullWidth
      required={props.required || false}
      placeholder={props.placeholder || ""}
      disabled={props.readOnly || false}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleToggleVisibility}
              edge="end"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <VisibilityOff sx={{ fontSize: 20 }} />
              ) : (
                <Visibility sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        sx: {
          inputLabelStyles,
        },
        shrink: true,
      }}
      onChange={(e) => {
        if (props.onChange && props.fieldName)
          props.onChange(props.fieldName, e.target.value);
      }}
      sx={textFieldStyles} // Apply styles from the custom hook
      variant="standard" // Apply outlined variant for better visual appeal
      error={props.error} // Convert error message to boolean
      helperText={props.helperText} // Show error message if exists
    />
  );
};

export default PasswordField;
