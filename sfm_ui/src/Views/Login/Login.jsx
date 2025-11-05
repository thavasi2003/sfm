import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAlertSnackbar from "../../common/hooks/useAlertSnackbar";
import AlertSnackbar from "../../common/components/AlertSnackbar";
import LoginLogo from "../../assests/sfm2.jpg";
import AdLogo from "../../assests/login-bg.jpg";

// 🖼️ Add your downloaded logos here:
import GoogleLogo from "../../assests/google.png";
import MicrosoftLogo from "../../assests/microsoft.png";

const Login = () => {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({ username: "", password: "" });
  const [error, setError] = useState({});
  const { alertState, showAlert, hideAlert } = useAlertSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
    setError((prevError) => ({ ...prevError, [name]: "" }));
  };

  const validate = () => {
    const error = {};
    if (!formFields.username) error.username = "Username is required!";
    if (!formFields.password) error.password = "Password is required!";
    setError(error);
    return Object.keys(error).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "http://coedev.smartbuildinginspection.com/api/v1/account/login",
          formFields
        );
        if (response.data.status === "success" && response.data.data) {
          sessionStorage.setItem(
            "userdata",
            JSON.stringify(response.data.data)
          );
          setFormFields({ username: "", password: "" });
          navigate("/home");
        } else {
          showAlert("Invalid credentials", "error");
        }
      } catch (error) {
        showAlert("Login Failed", "error");
        console.error("Error User login:", error);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://***REMOVED***:***REMOVED***/api/auth/google", "_self");
  };

  const handleMicrosoftLogin = () => {
    window.open("http://***REMOVED***:***REMOVED***/api/auth/microsoft", "_self");
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
    >
      {/* Left Side Image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${AdLogo})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: { xs: "none", md: "block" },
          height: "100vh",
        }}
      ></Box>

      {/* Right Side Login */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box sx={{ textAlign: "center", width: "100%", maxWidth: 400, p: 3 }}>
          {/* Logo */}
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <img
              src={LoginLogo}
              alt="Company Logo"
              style={{ height: "200px", maxWidth: "250px" }}
            />
          </Box>

          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 3, color: "#495057" }}
          >
            Welcome
          </Typography>

          {/* Login Form */}
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              id="username"
              label="Username"
              name="username"
              type="text"
              size="small"
              fullWidth
              error={!!error.username}
              helperText={error.username}
              value={formFields.username}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              sx={{
                input: { color: "#212529", backgroundColor: "#f8f9fa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ced4da" },
                  "&:hover fieldset": { borderColor: "#3ac47d" },
                  "&.Mui-focused fieldset": { borderColor: "#3ac47d" },
                },
              }}
            />
            <TextField
              id="password"
              label="Password"
              name="password"
              size="small"
              type="password"
              fullWidth
              value={formFields.password}
              error={!!error.password}
              helperText={error.password}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              sx={{
                input: { color: "#212529", backgroundColor: "#f8f9fa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ced4da" },
                  "&:hover fieldset": { borderColor: "#3ac47d" },
                  "&.Mui-focused fieldset": { borderColor: "#3ac47d" },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="small"
              sx={{
                mt: 3,
                mb: 2,
                fontSize: "1rem",
                color: "white",
                borderRadius: 1,
                backgroundColor: "#198754", // darker green for contrast
                "&:hover": { backgroundColor: "#157347" },
              }}
            >
              Login
            </Button>
          </Box>

          {/* Google Login */}
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={handleGoogleLogin}
            sx={{
              mb: 1,
              backgroundColor: "white",
              color: "black",
              border: "1px solid #ccc",
              textTransform: "none",
              "&:hover": { backgroundColor: "#f2f2f2" },
            }}
          >
            <img
              src={GoogleLogo} // ✅ Local PNG
              alt="Google"
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
            Login with Google
          </Button>

          {/* Microsoft Login */}
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={handleMicrosoftLogin}
            sx={{
              backgroundColor: "#0078D4",
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: "#005EA6" },
            }}
          >
            <img
              src={MicrosoftLogo} // ✅ Local PNG
              alt="Microsoft"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                background: "white",
                borderRadius: "2px",
              }}
            />
            Login with Microsoft
          </Button>
        </Box>
      </Box>

      <AlertSnackbar
        onClose={hideAlert}
        message={alertState.message}
        severity={alertState.severity}
      />
    </Container>
  );
};

export default Login;
