export const useTextFieldStyles = () => {
  const inputLabelStyles = {
    color: "gray", // Adjust label color
    "&.Mui-focused": {
      color: "blue", // Change label color when focused
    },
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1,
    },
    "& .MuiInputBase-input": {
      fontSize: 14,
    },
    "& .MuiInputLabel-root": {
      fontSize: 14, // Initial label font size
      // transform: "translate(15px, 10px) scale(1)", // Label position when not focused
    },
    "& .MuiInputLabel-shrink": {
      fontSize: 16, // Font size when label shrinks
      // transform: "translate(15px, -10px) scale(1)", // Adjust position when label shrinks
    },
  };

  return { inputLabelStyles, textFieldStyles };
};
