import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
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

  // Mobile Drawer UI (Sirf Logout dikhayega)
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
            {/* Mobile Menu Icon (Sirf Logout ke liye) */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" }, color: "#004c8f" }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo - Click karne par main dashboard par jayega */}
            <Typography
              variant="h6"
              onClick={() => navigate("/dashboard")}
              sx={{
                fontWeight: 800,
                color: "#004c8f",
                fontSize: { xs: "1.1rem", sm: "1.5rem" },
                cursor: "pointer",
              }}
            >
              SHREE<span style={{ color: "#ff8c00" }}> INVESTMENT</span>
            </Typography>

            {/* Desktop Navigation - Sirf Logout Button rakha hai */}
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleLogout}
                sx={{ fontWeight: 700, borderRadius: "20px" }}
              >
                LOGOUT
              </Button>
            </Box>
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
            ? "Admin Control Panel"
            : location.pathname === "/customer-list"
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
          © {new Date().getFullYear()} Shree Investment. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
