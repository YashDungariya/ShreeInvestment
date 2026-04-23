import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalNominees: 0,
    isLoading: true
  });

  const API_BASE = "https://shreeinvestment.in/api/";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Re-using the existing get_customers.php API to count records
      const res = await axios.get(`${API_BASE}get_customers.php`);
      const data = res.data;

      // Calculate Total Customers (yeh theek hai)
      const customersCount = data.length;

      // Calculate Total Nominees (NAYA LOGIC)
      let nomineesCount = 0;
      data.forEach(customer => {
        // Check agar 'nominees' array exist karta hai aur empty nahi hai
        if (customer.nominees && Array.isArray(customer.nominees)) {
          nomineesCount += customer.nominees.length;
        }
      });

      setStats({
        totalCustomers: customersCount,
        totalNominees: nomineesCount,
        isLoading: false
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cardData = [
    {
      id: "customers",
      title: "Customers",
      count: stats.totalCustomers,
      desc: "View and manage all customer details. Add, edit, or delete customer information.",
      icon: <GroupIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bgGradient: "linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)",
      blobColor: "rgba(33, 150, 243, 0.1)",
      path: "/customer-list",
    },
    {
      id: "nominees",
      title: "Nominees",
      count: stats.totalNominees,
      desc: "View all nominee information linked to customers. Track nominee details.",
      icon: <PersonAddIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bgGradient: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
      blobColor: "rgba(0, 176, 155, 0.1)",
      path: "/nominee-list",
    },
    {
      id: "uploads",
      title: "Uploads",
      count: "Manage", // Text instead of count for this one
      desc: "Manage customer documents and files. View Aadhar, PAN, and bank documents.",
      icon: <FileUploadIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bgGradient: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
      blobColor: "rgba(142, 45, 226, 0.1)",
      path: "/document-manager",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        flexWrap: { xs: "wrap", md: "nowrap" },
        mb: 5,
      }}
    >
      {cardData.map((card, index) => (
        <Card
          key={index}
          onClick={() => navigate(card.path)}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", md: "300px" },
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 20px 30px -10px rgba(0,0,0,0.1)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: card.blobColor,
            },
          }}
        >
          <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>

            {/* Header Area with Icon and Count */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: card.bgGradient,
                }}
              >
                {card.icon}
              </Box>

              {/* Dynamic Number Display */}
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Total
                </Typography>
                {stats.isLoading ? (
                  <CircularProgress size={24} sx={{ mt: 1, color: card.id === 'customers' ? '#2196f3' : card.id === 'nominees' ? '#00b09b' : '#8e2de2' }} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    {card.count}
                  </Typography>
                )}
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1.5, color: "#1e293b" }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 4,
                lineHeight: 1.6,
                minHeight: "48px",
              }}
            >
              {card.desc}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #f1f5f9",
                pt: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#94a3b8" }}
              >
                Click to manage
              </Typography>
              <ArrowForwardIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default AdminDashboard;