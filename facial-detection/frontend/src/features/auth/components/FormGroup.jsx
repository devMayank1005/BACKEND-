import React from "react";

const FormGroup = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
  required = true
}) => {
  const inputId = id || name;

  return (
    <div className="form-group">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  );
};

export default FormGroup;
