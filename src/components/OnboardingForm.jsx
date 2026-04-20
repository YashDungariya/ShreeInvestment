import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  CircularProgress,
  Backdrop,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CustomerDetails from "./CustomerDetails";
import NomineeDetails from "./NomineeDetails";
import DocumentUpload from "./DocumentUpload";
import axios from "axios";
import Swal from "sweetalert2";

const steps = ["Customer Details", "Nominee & Bank", "Upload Documents"];

const OnboardingForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    motherName: "",
    email: "",
    phone: "",
    aadharNumber: "",
    panNumber: "",
    birthPlace: "",
    notes: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineeId: "",
    nomineeContact: "",
    bankDetails: "",
  });
  const [files, setFiles] = useState({
    idProof: null,
    photo: null,
    panDoc: null,
    bankDoc: null,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e, fieldName) =>
    setFiles({ ...files, [fieldName]: e.target.files[0] });
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const saveToBackend = async (isFinalStep = false) => {
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (files.idProof) data.append("idProof", files.idProof);
    if (files.photo) data.append("photo", files.photo);
    if (files.panDoc) data.append("panDoc", files.panDoc);
    if (files.bankDoc) data.append("bankDoc", files.bankDoc);

    try {
      const res = await axios.post(
        "https://shreeinvestment.in/api/submit_form.php",
        data,
      );
      if (res.data.status === "success") {
        setLoading(false);
        await Swal.fire({
          icon: "success",
          title: isFinalStep ? "Success!" : "Data Saved!",
          text: isFinalStep
            ? "Application submitted successfully."
            : "Progress recorded.",
          timer: 1500,
          showConfirmButton: false,
        });
        if (isFinalStep) {
          // Success ke baad seedha listing par redirect kar sakte hain
          navigate("/customer-list");
        }
        return true;
      }
    } catch (err) {
      setLoading(false);
      Swal.fire({ icon: "error", title: "Error", text: "Connection failed." });
      return false;
    }
  };

  const handleNext = async () => {
    if (activeStep === 0 && (!formData.customerName || !formData.phone)) {
      Swal.fire("Wait!", "Name and Phone are required.", "warning");
      return;
    }
    if (await saveToBackend(false)) setActiveStep((prev) => prev + 1);
  };

  return (
    <Box>
      <Backdrop sx={{ color: "#fff", zIndex: 2000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* --- Back Arrow Header (Updated to navigate to listing) --- */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/customer-list")}
          sx={{ color: "#64748b", fontWeight: "bold" }}
        >
          Back to Listing
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: "40vh" }}>
          {activeStep === 0 && (
            <CustomerDetails formData={formData} handleChange={handleChange} />
          )}
          {activeStep === 1 && (
            <NomineeDetails formData={formData} handleChange={handleChange} />
          )}
          {activeStep === 2 && (
            <DocumentUpload handleFileChange={handleFileChange} files={files} />
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={
              activeStep === steps.length - 1
                ? () => saveToBackend(true)
                : handleNext
            }
          >
            {activeStep === steps.length - 1
              ? "Finish & Submit"
              : "Save & Next"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OnboardingForm;
