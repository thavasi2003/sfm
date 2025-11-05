import "./Main.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./src/common/theme/Theme.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./src/router";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
