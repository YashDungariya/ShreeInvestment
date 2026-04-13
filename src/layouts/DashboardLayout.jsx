import React from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
} from "@mui/material";
import {
  Logout,
  AccountBalance,
  PersonAdd,
  History,
  Description,
} from "@mui/icons-material";

const DashboardLayout = ({ children }) => {
  const menuItems = [
    { text: "Customer Entry", icon: <PersonAdd fontSize="small" /> },
    { text: "Financial Summary", icon: <AccountBalance fontSize="small" /> },
    { text: "Transactions", icon: <History fontSize="small" /> },
    { text: "Documents", icon: <Description fontSize="small" /> },
  ];

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

      {/* Top Blue Header */}
      <AppBar position="static" sx={{ bgcolor: "#004c8f", boxShadow: "none" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", px: "0 !important" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", letterSpacing: 1 }}
            >
              SHREE INVESTMENT
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Welcome, Admin
              </Typography>
              <Button startIcon={<Logout />} color="inherit" size="small">
                Logout
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Secondary Menu Bar (HDFC Style) */}
      <Box sx={{ bgcolor: "#003366", color: "white", mb: 3 }}>
        <Container maxWidth="xl">
          <Stack direction="row" spacing={1}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                startIcon={item.icon}
                sx={{
                  color: "white",
                  py: 1.5,
                  px: 3,
                  borderRadius: 0,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  "&:hover": { bgcolor: "#004c8f" },
                  borderBottom:
                    item.text === "Customer Entry"
                      ? "4px solid #ffcc00"
                      : "none", // Active indicator
                }}
              >
                {item.text}
              </Button>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 5 }}>
        {children}
      </Container>
    </Box>
  );
};

export default DashboardLayout;
