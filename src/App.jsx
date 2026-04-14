import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import CustomerList from "./components/CustomerList";
import OnboardingForm from "./components/OnboardingForm";
import NomineeList from "./components/NomineeList"; // Import karein

const theme = createTheme({
  palette: { primary: { main: "#004c8f" }, secondary: { main: "#003366" } },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("adminAuth") === "true",
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* 1. Login Logic */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <AdminLogin setAuth={setIsAuthenticated} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route path="/admin" element={<Navigate to="/login" />} />

          {/* 2. Admin Protected UI */}
          {isAuthenticated ? (
            <Route
              path="/*"
              element={
                <DashboardLayout setAuth={setIsAuthenticated}>
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/customer-list" element={<CustomerList />} />
                    <Route path="/nominee-list" element={<NomineeList />} />
                    <Route
                      path="/new-application"
                      element={<OnboardingForm />}
                    />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </DashboardLayout>
              }
            />
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
