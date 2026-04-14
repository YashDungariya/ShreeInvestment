import React from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardLayout = ({ children, setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setAuth(false);
    navigate("/login");
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
      <AppBar
        position="sticky"
        sx={{ bgcolor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#004c8f" }}>
              SHREE<span style={{ color: "#ff8c00" }}> INVESTMENT</span>
            </Typography>

            {/* Navigation Options */}
            <Stack direction="row" spacing={3}>
              <Button
                onClick={() => navigate("/new-application")}
                sx={{
                  color:
                    location.pathname === "/new-application"
                      ? "#004c8f"
                      : "#64748b",
                  fontWeight: 700,
                }}
              >
                ADD CUSTOMER
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                sx={{
                  color:
                    location.pathname === "/dashboard" ? "#004c8f" : "#64748b",
                  fontWeight: 700,
                }}
              >
                VIEW DATA
              </Button>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                LOGOUT
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ bgcolor: "#003366", color: "white", py: 1.5 }}>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ textTransform: "uppercase", letterSpacing: 1 }}
        >
          {location.pathname === "/dashboard"
            ? "Customer Applications Portal"
            : "Investment Application Form"}
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box sx={{ py: 2, textAlign: "center", bgcolor: "#e0e4e8" }}>
        <Typography variant="caption">
          © 2026 Shree Investment. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
