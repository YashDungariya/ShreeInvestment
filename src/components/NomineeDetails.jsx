import React from "react";
import { TextField, Typography, Box, Stack } from "@mui/material";

const NomineeDetails = ({ formData, handleChange }) => {
  // Label style consistent with CustomerDetails
  const LabelStyle = {
    fontWeight: "bold",
    color: "#000",
    mb: 1,
    display: "block",
    fontSize: "0.9rem",
    textAlign: "left",
  };

  // Modern Flat Input Style
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
      {/* Note for Required Fields */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          sx={{ color: "red", fontStyle: "italic", fontWeight: "bold" }}
        >
          NOTE: Please fill necessary fields marked *
        </Typography>
      </Box>

      {/* Row 1: Nominee Name & Relationship */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 4, width: "100%" }}
      >
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Nominee Name *</Typography>
          <TextField
            placeholder="Nominee's full name"
            name="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Nominee Relationship *</Typography>
          <TextField
            placeholder="e.g. Spouse, Father"
            name="nomineeRelation"
            value={formData.nomineeRelation}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
      </Stack>

      {/* Row 2: ID & Contact */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 4, width: "100%" }}
      >
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Nominee PAN / Aadhaar</Typography>
          <TextField
            placeholder="Enter ID Number"
            name="nomineeId"
            value={formData.nomineeId}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Nominee Contact Number</Typography>
          <TextField
            placeholder="Phone Number"
            name="nomineeContact"
            value={formData.nomineeContact}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 4, width: "100%" }}
      >
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Nominee Email ID</Typography>
          <TextField
            placeholder="email@example.com"
            name="nomineeEmail"
            value={formData.nomineeEmail || ""}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography sx={LabelStyle}>Bank Details (Cheque / Passbook)</Typography>
          <TextField
            placeholder="Account No, IFSC, Bank Name"
            name="bankDetails"
            value={formData.bankDetails || ""}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Box>
      </Stack>

      {/* Row 4: Dynamic Notes (Text Area) */}
      <Box sx={{ width: "100%", mb: 4 }}>
        <Typography sx={LabelStyle}>Nominee Dynamic Notes</Typography>
        <TextField
          multiline
          minRows={3}
          placeholder="Enter additional information about nominee here..."
          name="nomineeNotes"
          value={formData.nomineeNotes || ""}
          onChange={handleChange}
          size="small"
          sx={InputStyle}
        />
      </Box>
    </Box>
  );
};

export default NomineeDetails;
