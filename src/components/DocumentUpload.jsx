import React from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const DocumentUpload = ({ handleFileChange, files }) => {
  const uploadFields = [
    { label: "Customer Photo", name: "customerPhoto" },
    { label: "Aadhaar Card (Front & Back)", name: "aadharDoc" },
    { label: "PAN Card", name: "panDoc" },
    { label: "Bank Passbook/Cheque", name: "bankDoc" },
  ];

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" color="secondary" gutterBottom align="center">
        Upload Documents (JPG Only)
      </Typography>
      <Stack spacing={2} sx={{ mt: 3, maxWidth: 500, mx: "auto" }}>
        {uploadFields.map((field) => (
          <Paper
            key={field.name}
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">{field.label}</Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
              size="small"
            >
              Upload
              <input
                type="file"
                hidden
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFileChange(e, field.name)}
              />
            </Button>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default DocumentUpload;
