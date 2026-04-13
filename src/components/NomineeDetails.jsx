import React from "react";
import { Grid, TextField, Typography, Box } from "@mui/material";

const NomineeDetails = ({ formData, handleChange }) => {
  const LabelStyle = {
    fontWeight: "bold",
    color: "#000",
    mb: 1,
    display: "block",
    fontSize: "0.9rem",
  };
  const InputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f5f5f5",
      "& fieldset": { border: "none" },
      "&.Mui-focused fieldset": { border: "1px solid #004c8f" },
    },
    mb: 3,
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography
        variant="h6"
        sx={{ color: "#004c8f", mb: 3, fontWeight: "bold" }}
      >
        Nominee & Bank Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography sx={LabelStyle}>Nominee Name *</Typography>
          <TextField
            fullWidth
            placeholder="Nominee's full name"
            name="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography sx={LabelStyle}>Nominee Relationship *</Typography>
          <TextField
            fullWidth
            placeholder="e.g. Spouse, Father"
            name="nomineeRelation"
            value={formData.nomineeRelation}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography sx={LabelStyle}>Nominee PAN / Aadhaar</Typography>
          <TextField
            fullWidth
            placeholder="ID Number"
            name="nomineeId"
            value={formData.nomineeId}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography sx={LabelStyle}>Nominee Contact Number</Typography>
          <TextField
            fullWidth
            placeholder="Phone Number"
            name="nomineeContact"
            value={formData.nomineeContact}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography sx={LabelStyle}>
            Bank Details (Cheque / Passbook)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Account No, IFSC, Bank Name"
            name="bankDetails"
            value={formData.bankDetails}
            onChange={handleChange}
            size="small"
            sx={InputStyle}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NomineeDetails;
