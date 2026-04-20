import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  AppBar,
  Toolbar,
  CssBaseline,
  InputAdornment, IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminLogin = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({ phone: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onLogin = (e) => {
    e.preventDefault();
    // Static Credentials
    if (
      credentials.phone === "9879076571" &&
      credentials.password === "admin@123"
    ) {
      localStorage.setItem("adminAuth", "true"); // Persistent Login
      setAuth(true); // App state update
      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid Phone or Password",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f4f7fa",
      }}
    >
      <CssBaseline />

      {/* --- HEADER --- */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#004c8f",
                fontFamily: "'Public Sans', sans-serif",
              }}
            >
              SHREE<span style={{ color: "#ff8c00" }}> INVESTMENT</span>
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- LOGIN FORM --- */}
      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="xs">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: "bold", mb: 3, color: "#004c8f" }}
            >
              ADMIN LOGIN
            </Typography>
            <form onSubmit={onLogin}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                variant="outlined"
                sx={{ mb: 2 }}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                sx={{ mb: 3 }}
                onChange={handleInputChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                sx={{ bgcolor: "#004c8f", py: 1.5, fontWeight: "bold" }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Container>
      </Container>

      {/* --- FOOTER --- */}
      <Box sx={{ py: 2, textAlign: "center", bgcolor: "#e0e4e8" }}>
        <Typography variant="caption" color="textSecondary">
          © {new Date().getFullYear()} Shree Investment. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminLogin;
