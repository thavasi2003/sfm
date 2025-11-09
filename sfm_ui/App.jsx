import "./Main.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./src/common/theme/Theme.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./Router.jsx";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
