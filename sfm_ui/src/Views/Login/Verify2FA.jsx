import React, { useState, useEffect } from "react";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAlertSnackbar from "../../common/hooks/useAlertSnackbar";
import AlertSnackbar from "../../common/components/AlertSnackbar";

const Verify2FA = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { alertState, showAlert, hideAlert } = useAlertSnackbar();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailFromUrl = queryParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, []);

  const handleVerify = async () => {
    if (!otp) {
      showAlert("Please enter your OTP", "warning");
      return;
    }

    try {
      const res = await fetch("http://***REMOVED***:***REMOVED***/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.message === "2FA verification successful") {
        const { user, token } = data;

        if (!token) {
          showAlert("Token missing in response. Please check backend.", "error");
          return;
        }

        sessionStorage.setItem("userdata", JSON.stringify({ user, token }));
        showAlert("Login successful!", "success");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        showAlert(data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.error("2FA verification failed:", error);
      showAlert("Server error during OTP verification", "error");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          textAlign: "center",
          bgcolor: "white",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Enter 2FA Code
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
          We’ve sent a verification code to <b>{email}</b>
        </Typography>

        <TextField
          label="Enter OTP"
          variant="outlined"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          size="small"
          sx={{
            mb: 2,
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
          onClick={handleVerify}
          sx={{
            backgroundColor: "#198754",
            "&:hover": { backgroundColor: "#157347" },
            color: "white",
          }}
        >
          Verify
        </Button>
      </Box>

      <AlertSnackbar
        onClose={hideAlert}
        message={alertState.message}
        severity={alertState.severity}
      />
    </Container>
  );
};

export default Verify2FA;
