import React from "react";
import { TextField, Typography, Box, Stack } from "@mui/material";

const CustomerDetails = ({ formData, handleChange }) => {
  // Label style for professional banking look
  const LabelStyle = {
    fontWeight: "bold",
    color: "#000",
    mb: 1,
    display: "block",
    fontSize: "0.9rem",
    textAlign: "left",
  };

  // Modern Flat Input Style with increased width
  const InputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
      fontSize: "1rem",
      "& fieldset": { border: "none" },
      "&.Mui-focused fieldset": { border: "1px solid #004c8f" },
    },
    width: "100%",
  };

  return (
    <Box sx={{ p: 1, width: "100%" }}>
      {/* Required Note at Top */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          sx={{ color: "red", fontStyle: "italic", fontWeight: "bold" }}
        >
          NOTE: Please fill necessary fields marked *
        </Typography>
      </Box>

      {/* Row 1: Name, Mother's Name, Email */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 4, width: "100%" }}
      >
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Customer Name *</Typography>
          <TextField
            placeholder="Enter Full Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Mother's Name *</Typography>
          <TextField
            placeholder="Enter Mother's Name"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Email ID</Typography>
          <TextField
            placeholder="email@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
      </Stack>

      {/* Row 2: Aadhaar Number, PAN Number, Phone Number */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 4, width: "100%" }}
      >
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Aadhaar Number *</Typography>
          <TextField
            placeholder="12 Digit Aadhaar Number"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
            inputProps={{ maxLength: 12 }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>PAN Number *</Typography>
          <TextField
            placeholder="ABCDE1234F"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
            inputProps={{
              style: { textTransform: "uppercase" },
              maxLength: 10,
            }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Phone Number *</Typography>
          <TextField
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
      </Stack>

      {/* Row 3: Birth Place & Notes */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 4, width: "100%" }}
      >
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Birth Place</Typography>
          <TextField
            placeholder="City / State"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
        <Box sx={{ flex: 2, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Dynamic Notes</Typography>
          <TextField
            multiline
            rows={1}
            placeholder="Enter additional information here..."
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default CustomerDetails;
