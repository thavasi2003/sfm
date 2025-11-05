import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useTextFieldStyles } from "../styles/useTextFieldStyle";

const DateField = ({ props }) => {
  const { inputLabelStyles, textFieldStyles } = useTextFieldStyles();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={props.label}
        disabled={props.readOnly || false}
        value={props.value}
        onChange={(date) => {
          if (props.onChange && props.fieldName) {
            props.onChange(props.fieldName, date);
          }
        }}
        slotProps={{
          textField: {
            required: props.required || false,
            fullWidth: true,
            error: props.error,
            helperText: props.helperText,
            disabled: props.readOnly || false,
            value: props.value,
            variant: "standard",
            sx: textFieldStyles,
            InputLabelProps: {
              sx: inputLabelStyles,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateField;
