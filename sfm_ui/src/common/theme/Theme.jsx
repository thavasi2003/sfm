import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#fff", // Green color (adjust as needed)
    },
    secondary: {
      main: "#F5F5F5", // Orange color
    },
    background: {
      default: "rgb(255, 255, 255)", // Dark background
      paper: "#333", // Slightly lighter background
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "rgba(255, 255, 255, 0.7)", // Light white
    },
  },
  typography: {
    fontFamily: "'Ubuntu', sans-serif",
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#4caf50", // Sidebar background color
          color: "#fff", // Sidebar text color
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        },
      },
    },
  },
});
