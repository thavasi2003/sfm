import React, { useState } from "react";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTextFieldStyles } from "../styles/useTextFieldStyle";
import dayjs from "dayjs";

const TimeField = ({ props }) => {
  const { inputLabelStyles, textFieldStyles } = useTextFieldStyles(); // Use the styles
  const [value, setValue] = useState(props.value ? dayjs(props.value) : null);
  const handleChange = (newValue) => {
    setValue(newValue);
    if (props.onChange && props.fieldName) {
      props.onChange(props.fieldName, newValue ? newValue.toString() : "");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={props.label}
        disabled={props.readOnly || false}
        value={value}
        onChange={handleChange}
        sx={textFieldStyles} // Apply styles from the custom hook
        slotProps={{
          textField: {
            fullWidth: true,
            variant: "standard",
            required: props.required,
            disabled: props.readOnly,
            error: props.error,
            helperText: props.helperText,
            InputLabelProps: {
              sx: inputLabelStyles,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default TimeField;
