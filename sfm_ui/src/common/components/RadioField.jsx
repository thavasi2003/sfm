import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";

const RadioField = ({ props }) => {
  // Initialize state with props.value if available
  const [selectedValue, setSelectedValue] = useState(
    props.value || { key: "", value: "" }
  );

  // Sync state if props.value changes
  useEffect(() => {
    if (props.value) {
      setSelectedValue(props.value);
    }
  }, [props.value]);

  // Handle radio button change event
  const handleChange = (event) => {
    const newKey = event.target.value;
    const newValue =
      props.dataResult.find((option) => option.ref_key === newKey)?.ref_value ||
      "";
    const newSelectedValue = { key: newKey, value: newValue };
    setSelectedValue(newSelectedValue); // Update local state
    props.onChange?.(props.fieldName, newSelectedValue); // Pass updated value to parent
  };

  return (
    <FormControl
      component="fieldset"
      size="small"
      required={props.required || false}
      disabled={props.readOnly || false}
      error={props.error}
    >
      <FormLabel component="legend" sx={{ fontSize: 13 }}>
        {props.label}
      </FormLabel>

      <RadioGroup value={selectedValue.key} onChange={handleChange} row>
        {Array.isArray(props.dataResult) &&
          props.dataResult.map((option) => (
            <FormControlLabel
              key={option.ref_key}
              value={option.ref_key}
              control={<Radio size="small" />}
              label={option.ref_value}
              sx={{
                fontSize: 13,
                "& .MuiFormControlLabel-label": {
                  fontSize: 13,
                },
              }}
            />
          ))}
      </RadioGroup>

      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
};

export default RadioField;
