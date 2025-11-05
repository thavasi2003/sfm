import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useTextFieldStyles } from "../styles/useTextFieldStyle";

const SelectField = ({ props }) => {
  const { inputLabelStyles, textFieldStyles } = useTextFieldStyles();

  // Use state to track selected value as { key: "", value: "" }
  const [selectedValue, setSelectedValue] = useState({ key: "", value: "" });

  const handleChange = (event) => {
    const selectedKey = event.target.value;
    const selectedOption = props.dataResult?.find(
      (option) => option.ref_key === selectedKey
    );

    const newValue = {
      key: selectedKey,
      value: selectedOption ? selectedOption.ref_value : "",
    };

    setSelectedValue(newValue);

    if (props.onChange && props.fieldName) {
      props.onChange(props.fieldName, newValue); // Pass updated value as {key, value}
    }
  };

  return (
    <FormControl
      component="div"
      fullWidth
      sx={textFieldStyles}
      required={props.required || false}
      disabled={props.readOnly || false}
      variant="standard"
      error={props.error}
    >
      <InputLabel sx={inputLabelStyles}>{props.label}</InputLabel>
      <Select
        value={selectedValue.key || props.value?.key || ""}
        label={props.label}
        disabled={props.readOnly || false}
        onChange={handleChange}
      >
        {Array.isArray(props.dataResult) && props.dataResult.length > 0 ? (
          props.dataResult.map((option) => (
            <MenuItem key={option.ref_key} value={option.ref_key}>
              <Typography fontSize={13}>{option.ref_value}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem value="" disabled>
            No options available
          </MenuItem>
        )}
      </Select>
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;
