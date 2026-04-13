import React from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DocumentUpload = ({ handleFileChange, files }) => {
  const LabelStyle = {
    fontWeight: "bold",
    color: "#000",
    mb: 1,
    display: "block",
    fontSize: "0.9rem",
  };

  const UploadButtonStyle = {
    bgcolor: "#ff8c00",
    color: "white",
    width: "100%",
    py: 2,
    borderRadius: "30px",
    textTransform: "none",
    fontWeight: "bold",
    "&:hover": { bgcolor: "#e67e00" },
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography
        variant="h6"
        sx={{
          color: "#004c8f",
          mb: 4,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Final Step: Verification Documents
      </Typography>

      <Grid container spacing={6} justifyContent="center">
        {/* Aadhaar Upload */}
        <Grid item xs={12} md={5}>
          <Typography sx={LabelStyle}>Aadhaar Card (Front & Back) *</Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={UploadButtonStyle}
          >
            Upload Identification Form
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, "idProof")}
            />
          </Button>
          <Typography
            variant="caption"
            sx={{ mt: 1, display: "block", color: "gray" }}
          >
            {files.idProof
              ? `Selected: ${files.idProof.name}`
              : "*PDF or JPG preferred"}
          </Typography>
        </Grid>

        {/* Photo Upload */}
        <Grid item xs={12} md={5}>
          <Typography sx={LabelStyle}>Passport Size Photo *</Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={UploadButtonStyle}
          >
            Upload Passport Photo
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, "photo")}
            />
          </Button>
          <Typography
            variant="caption"
            sx={{ mt: 1, display: "block", color: "gray" }}
          >
            {files.photo
              ? `Selected: ${files.photo.name}`
              : "*Upload most recent photo"}
          </Typography>
        </Grid>

        {/* PAN Upload */}
        <Grid item xs={12} md={5}>
          <Typography sx={LabelStyle}>PAN Card Copy</Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={UploadButtonStyle}
          >
            Upload PAN Card
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, "panDoc")}
            />
          </Button>
        </Grid>

        {/* Bank Passbook Upload */}
        <Grid item xs={12} md={5}>
          <Typography sx={LabelStyle}>Bank Passbook / Cheque</Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={UploadButtonStyle}
          >
            Upload Bank Document
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, "bankDoc")}
            />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentUpload;
