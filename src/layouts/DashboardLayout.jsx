import React from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";

const DashboardLayout = ({ children }) => {
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

      {/* Top Blue Header - Focused on Branding only */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo Section */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color: "#004c8f", // Classic Blue Logo
                  fontFamily: "'Public Sans', sans-serif",
                }}
              >
                SHREE<span style={{ color: "#ff8c00" }}> INVESTMENT</span>
              </Typography>
            </Box>

            {/* Application Title - Right Side (Subtle) */}
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Digital Onboarding
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Sub-header for Application Title */}
      <Box sx={{ bgcolor: "#003366", color: "white", py: 1.5, mb: 4 }}>
        <Container maxWidth="xl">
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Investment Application Form
          </Typography>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 5 }}>
        {children}
      </Container>

      {/* Simple Footer for Professionalism */}
      <Box sx={{ py: 2, textAlign: "center", bgcolor: "#e0e4e8" }}>
        <Typography variant="caption" color="textSecondary">
          © {new Date().getFullYear()} Shree Investment. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
