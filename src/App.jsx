import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
  Container,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import DashboardLayout from "./layouts/DashboardLayout";
import CustomerDetails from "./components/CustomerDetails";
import NomineeDetails from "./components/NomineeDetails";
import DocumentUpload from "./components/DocumentUpload";
// import axios from "axios";

const theme = createTheme({
  palette: { primary: { main: "#004c8f" }, secondary: { main: "#003366" } },
});

const steps = ["Customer Details", "Nominee & Bank", "Upload Documents"];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    customerName: "",
    motherName: "",
    email: "",
    phone: "",
    birthPlace: "",
    notes: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineeId: "",
    nomineeContact: "",
    folioNo: "",
    bankDetails: "",
  });
  const [files, setFiles] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e, fieldName) => {
    setFiles({ ...files, [fieldName]: e.target.files[0] });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const data = new FormData();
    // Append text data
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    // Append files
    Object.keys(files).forEach((key) => data.append(key, files[key]));

    try {
      const res = await axios.post(
        "https://your-domain.com/api/submit.php",
        data,
      );
      alert("Application Submitted Successfully!");
    } catch (err) {
      console.error(err);
      alert("Submission Failed!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout>
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
              <CustomerDetails
                formData={formData}
                handleChange={handleChange}
              />
            )}
            {activeStep === 1 && (
              <NomineeDetails formData={formData} handleChange={handleChange} />
            )}
            {activeStep === 2 && (
              <DocumentUpload
                handleFileChange={handleFileChange}
                files={files}
              />
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              pt: 2,
              borderTop: "1px solid #eee",
            }}
          >
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
            >
              {activeStep === steps.length - 1
                ? "Finish & Submit"
                : "Save & Next"}
            </Button>
          </Box>
        </Paper>
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default App;
