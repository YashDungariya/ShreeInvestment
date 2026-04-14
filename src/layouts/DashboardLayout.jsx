import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardLayout = ({ children, setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setAuth(false);
    navigate("/login");
  };

  const navItems = [
    { label: "ADD CUSTOMER", path: "/new-application" },
    { label: "VIEW DATA", path: "/dashboard" },
  ];

  // Mobile Drawer UI
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, fontWeight: 800, color: "#004c8f" }}
      >
        SHREE <span style={{ color: "#ff8c00" }}>INVESTMENT</span>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{ textAlign: "center" }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 700,
                  color:
                    location.pathname === item.path ? "#004c8f" : "#64748b",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ textAlign: "center" }}>
            <ListItemText
              primary="LOGOUT"
              primaryTypographyProps={{ fontWeight: 700, color: "error.main" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

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
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{ justifyContent: "space-between", px: { xs: 0, sm: 2 } }}
          >
            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" }, color: "#004c8f" }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#004c8f",
                fontSize: { xs: "1.1rem", sm: "1.5rem" },
              }}
            >
              SHREE<span style={{ color: "#ff8c00" }}> INVESTMENT</span>
            </Typography>

            {/* Desktop Navigation (Hidden on Mobile) */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color:
                      location.pathname === item.path ? "#004c8f" : "#64748b",
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleLogout}
                sx={{ fontWeight: 700 }}
              >
                LOGOUT
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Blue Sub-header */}
      <Box sx={{ bgcolor: "#003366", color: "white", py: 1.5 }}>
        <Typography
          variant="subtitle2"
          align="center"
          sx={{
            textTransform: "uppercase",
            letterSpacing: 1,
            px: 2,
            fontSize: { xs: "0.75rem", sm: "0.9rem" },
          }}
        >
          {location.pathname === "/dashboard"
            ? "Customer Applications Portal"
            : "Investment Application Form"}
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 2, textAlign: "center", bgcolor: "#e0e4e8", mt: "auto" }}>
        <Typography
          variant="caption"
          sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
        >
          © 2026 Shree Investment. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
