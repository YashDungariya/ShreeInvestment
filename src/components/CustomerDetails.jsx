import React from "react";
import { Grid, TextField, Typography, Box, Divider } from "@mui/material";

const CustomerDetails = ({ formData, handleChange }) => {
  const LabelStyle = {
    fontWeight: "bold",
    color: "#000",
    mb: 1,
    display: "block",
    fontSize: "0.95rem",
  };

  const InputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
      "& fieldset": { border: "none" },
      "&.Mui-focused fieldset": { border: "1px solid #004c8f" },
    },
    mb: 4, // Har input ke baad thoda extra space professional lagta hai
  };

  return (
    <Box sx={{ p: 2, maxWidth: "1000px", mx: "auto" }}>
      {/* Form Title Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#003366" }}>
          CUSTOMER PERSONAL DETAILS
        </Typography>
        <Divider
          sx={{
            mt: 1,
            mb: 2,
            width: "100px",
            height: "3px",
            bgcolor: "#ff8c00",
          }}
        />
        <Typography
          variant="body2"
          sx={{ color: "red", fontStyle: "italic", fontWeight: "bold" }}
        >
          NOTE: Please fill necessary fields marked *
        </Typography>
      </Box>

      {/* Inputs with Increased Width using Grid */}
      <Grid container spacing={2}>
        {/* Full width row for important details or two wide columns */}
        <Grid item xs={12} md={10} lg={8}>
          <Typography sx={LabelStyle}>Customer Name *</Typography>
          <TextField
            fullWidth
            placeholder="Enter Full Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>

        <Grid item xs={12} md={10} lg={8}>
          <Typography sx={LabelStyle}>Mother's Name *</Typography>
          <TextField
            fullWidth
            placeholder="Enter Mother's Name"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>

        <Grid item xs={12} md={10} lg={8}>
          <Typography sx={LabelStyle}>Email ID</Typography>
          <TextField
            fullWidth
            placeholder="email@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>

        <Grid item xs={12} md={10} lg={8}>
          <Typography sx={LabelStyle}>Phone Number *</Typography>
          <TextField
            fullWidth
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>

        <Grid item xs={12} md={10} lg={8}>
          <Typography sx={LabelStyle}>Birth Place</Typography>
          <TextField
            fullWidth
            placeholder="City / State"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>

        <Grid item xs={12} md={10} lg={8}>
          <Typography sx={LabelStyle}>Dynamic Notes</Typography>
          <TextField
            fullWidth
            multiline
            rows={1}
            placeholder="Enter additional information here..."
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDetails;
