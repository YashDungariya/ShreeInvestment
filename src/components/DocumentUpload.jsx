import React from "react";
import { Typography, Box, Button, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DocumentUpload = ({ handleFileChange, files }) => {
  // Label style consistent with other forms
  const LabelStyle = {
    fontWeight: "bold",
    color: "#000",
    mb: 1,
    display: "block",
    fontSize: "0.9rem",
  };

  // Small, Compact and Professional Upload Button Style
  const UploadButtonStyle = {
    bgcolor: "#ff8c00",
    color: "white",
    width: "fit-content",
    px: 2, // Padding kam kar di hai
    py: 0.5, // Height kam karne ke liye padding kam ki hai
    borderRadius: "4px", // Rounded se square-ish kiya hai banking look ke liye
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "0.75rem", // Font size thoda aur small rakha hai
    "&:hover": { bgcolor: "#e67e00" },
    boxShadow: "none", // Excessive shadow hata di hai
  };

  return (
    <Box sx={{ p: 1, width: "100%" }}>
      {/* Required Note at Top */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          sx={{ color: "red", fontStyle: "italic", fontWeight: "bold" }}
        >
          NOTE: Please upload clear documents for verification *
        </Typography>
      </Box>

      {/* Upload Rows using Stack */}
      <Stack spacing={4}>
        {/* Row 1: Aadhaar & Photo */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={LabelStyle}>
              Aadhaar Card (Front & Back) *
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={
                <CloudUploadIcon sx={{ fontSize: "1rem !important" }} />
              }
              sx={UploadButtonStyle}
            >
              Upload Aadhaar
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange(e, "idProof")}
              />
            </Button>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "block",
                color: "gray",
                fontSize: "0.7rem",
              }}
            >
              {files.idProof
                ? `Selected: ${files.idProof.name}`
                : "*PDF or JPG preferred"}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography sx={LabelStyle}>Passport Size Photo *</Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={
                <CloudUploadIcon sx={{ fontSize: "1rem !important" }} />
              }
              sx={UploadButtonStyle}
            >
              Upload Photo
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange(e, "photo")}
              />
            </Button>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "block",
                color: "gray",
                fontSize: "0.7rem",
              }}
            >
              {files.photo
                ? `Selected: ${files.photo.name}`
                : "*Please upload most recent photo"}
            </Typography>
          </Box>
        </Stack>

        {/* Row 2: PAN & Bank */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={LabelStyle}>PAN Card Copy</Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={
                <CloudUploadIcon sx={{ fontSize: "1rem !important" }} />
              }
              sx={UploadButtonStyle}
            >
              Upload PAN
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange(e, "panDoc")}
              />
            </Button>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "block",
                color: "gray",
                fontSize: "0.7rem",
              }}
            >
              {files.panDoc
                ? `Selected: ${files.panDoc.name}`
                : "*Upload PAN for tax purposes"}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography sx={LabelStyle}>Bank Passbook / Cheque</Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={
                <CloudUploadIcon sx={{ fontSize: "1rem !important" }} />
              }
              sx={UploadButtonStyle}
            >
              Upload Bank Doc
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange(e, "bankDoc")}
              />
            </Button>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "block",
                color: "gray",
                fontSize: "0.7rem",
              }}
            >
              {files.bankDoc
                ? `Selected: ${files.bankDoc.name}`
                : "*Upload preferred bank document"}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DocumentUpload;
