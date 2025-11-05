import React, { useRef } from "react";

const Form = ({
  label,
  name,
  type,
  value,
  onChange,
  options = [],
  error,
  required,
  disabled,
  readOnly,
  checked, // for checkbox and radio
  min, // for number and date inputs
  max, // for number and date inputs
  accept, // for file input
  multiple, // for file input
}) => {
  const fileInputRef = useRef(null);

  const commonProps = {
    name,
    onChange,
    disabled,
    readOnly,
  };

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select
            {...commonProps}
            value={value}
            className={!value ? "placeholder" : ""}
          >
            <option key="" value="">
              Select {label}
            </option>
            {options.map((option, index) => (
              <option key={index} value={option.value || ""}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={value}
            placeholder={`Enter ${label}`}
          />
        );
      case "password":
      case "text":
      case "email":
      case "url":
      case "tel":
      case "date":
      case "number":
        return (
          <input
            type={type}
            {...commonProps}
            value={value}
            placeholder={`Enter ${label}`}
            min={min}
            max={max}
          />
        );
      case "file":
        return (
          <input
            type={type}
            name={name}
            onChange={onChange}
            ref={fileInputRef}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
          />
        );
      case "checkbox":
      case "radio":
        return <input type={type} {...commonProps} checked={checked} />;
      default:
        return (
          <input
            type="text"
            {...commonProps}
            value={value}
            placeholder={`Enter ${label}`}
          />
        );
    }
  };

  return (
    <div className="form-group">
      <label>
        {/* {required && <span className="required">*</span>} */}
        {label}:
      </label>
      {renderInput()}
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default Form;
