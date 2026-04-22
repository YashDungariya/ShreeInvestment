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
    nominees: [
      {
        nomineeName: "",
        nomineeRelation: "",
        nomineeId: "",
        nomineeContact: "",
        nomineeEmail: "",
        bankDetails: "",
        nomineeNotes: ""
      }
    ],
  });
  // 1. Apni state ko update karein:
  const [files, setFiles] = useState({
    idProof: null,
    photo: null,
    panDoc: null,
    bankDoc: null,
    nominees: [] // Nominee files yahan aayengi
  });

  // 2. Naya Handler banayein SPECIFICALLY nominee files ke liye
  const handleNomineeFileChange = (e, fieldName, nomineeIndex) => {
    const updatedNomineeFiles = [...(files.nominees || [])];

    // Agar us index pe koi object nahi hai, toh pehle empty object banao
    if (!updatedNomineeFiles[nomineeIndex]) {
      updatedNomineeFiles[nomineeIndex] = {};
    }

    // File store karo
    updatedNomineeFiles[nomineeIndex][fieldName] = e.target.files[0];

    setFiles({ ...files, nominees: updatedNomineeFiles });
  };

  // 3. purana handler waise ka waisa rakhne dein (sirf Customer ke liye)
  const handleFileChange = (e, fieldName) => {
    setFiles({ ...files, [fieldName]: e.target.files[0] });
  };

  const handleNomineeChange = (index, e) => {
    const updatedNominees = [...formData.nominees];
    updatedNominees[index][e.target.name] = e.target.value;
    setFormData({ ...formData, nominees: updatedNominees });
  };
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  // const handleFileChange = (e, fieldName) =>
  //   setFiles({ ...files, [fieldName]: e.target.files[0] });
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const saveToBackend = async (isFinalStep = false) => {
    setLoading(true); // Loading Start

    try {
      const data = new FormData();

      // Convert Nominees array to JSON string safely
      Object.keys(formData).forEach((key) => {
        if (key === "nominees") {
          // Verify it's an array before stringifying
          const nomineesArray = Array.isArray(formData[key]) ? formData[key] : [];
          data.append(key, JSON.stringify(nomineesArray));
        } else {
          data.append(key, formData[key] || ""); // Fallback to empty string if undefined
        }
      });

      // Append files if they exist
      if (files.idProof) data.append("idProof", files.idProof);
      if (files.photo) data.append("photo", files.photo);
      if (files.panDoc) data.append("panDoc", files.panDoc);
      if (files.bankDoc) data.append("bankDoc", files.bankDoc);
      if (files.nomineeIdProof) data.append("nomineeIdProof", files.nomineeIdProof);
      if (files.nomineePhoto) data.append("nomineePhoto", files.nomineePhoto);
      if (files.nomineePanDoc) data.append("nomineePanDoc", files.nomineePanDoc);
      if (files.nomineeBankDoc) data.append("nomineeBankDoc", files.nomineeBankDoc);

      // Log FormData contents to Console for debugging (F12 -> Console me dekhein)
      console.log("--- Sending Data to Backend ---");
      for (let pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      const res = await axios.post(
        "https://shreeinvestment.in/api/submit_form.php",
        data
      );

      setLoading(false); // Stop loading when response arrives

      if (res.data && res.data.status === "success") {
        await Swal.fire({
          icon: "success",
          title: isFinalStep ? "Success!" : "Data Saved!",
          text: isFinalStep ? "Application submitted successfully." : "Progress recorded.",
          timer: 1500,
          showConfirmButton: false,
        });
        if (isFinalStep) {
          navigate("/customer-list");
        }
        return true;
      } else {
        // Backend returned an error response
        console.error("Backend Error Response:", res.data);
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: res.data?.message || "Failed to save data. Check console."
        });
        return false;
      }
    } catch (err) {
      setLoading(false); // Stop loading if request crashes
      console.error("Axios/Network Error:", err);

      // Better error message
      let errorMsg = "Connection failed. Please check your internet or CORS policy.";
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMsg = `Server error: ${err.response.status} - ${err.response.data?.message || err.message}`;
      }

      Swal.fire({ icon: "error", title: "Error", text: errorMsg });
      return false;
    }
  };

  const handleNext = async () => {
    // Add basic validation
    if (activeStep === 0) {
      if (!formData.customerName || !formData.phone) {
        Swal.fire("Wait!", "Name and Phone are required.", "warning");
        return;
      }
    }

    // Call the backend and wait for result
    const isSuccess = await saveToBackend(false);

    // ONLY move to next step if save was successful
    if (isSuccess) {
      setActiveStep((prev) => prev + 1);
    }
  };

  // const saveToBackend = async (isFinalStep = false) => {
  //   setLoading(true);
  //   const data = new FormData();
  //   Object.keys(formData).forEach((key) => data.append(key, formData[key]));
  //   if (files.idProof) data.append("idProof", files.idProof);
  //   if (files.photo) data.append("photo", files.photo);
  //   if (files.panDoc) data.append("panDoc", files.panDoc);
  //   if (files.bankDoc) data.append("bankDoc", files.bankDoc);

  //   try {
  //     const res = await axios.post(
  //       "https://shreeinvestment.in/api/submit_form.php",
  //       data,
  //     );
  //     if (res.data.status === "success") {
  //       setLoading(false);
  //       await Swal.fire({
  //         icon: "success",
  //         title: isFinalStep ? "Success!" : "Data Saved!",
  //         text: isFinalStep
  //           ? "Application submitted successfully."
  //           : "Progress recorded.",
  //         timer: 1500,
  //         showConfirmButton: false,
  //       });
  //       if (isFinalStep) {
  //         // Success ke baad seedha listing par redirect kar sakte hain
  //         navigate("/customer-list");
  //       }
  //       return true;
  //     }
  //   } catch (err) {
  //     setLoading(false);
  //     Swal.fire({ icon: "error", title: "Error", text: "Connection failed." });
  //     return false;
  //   }
  // };
  const addNominee = () => {
    setFormData({
      ...formData,
      nominees: [
        ...formData.nominees,
        { nomineeName: "", nomineeRelation: "", nomineeId: "", nomineeContact: "", nomineeEmail: "", bankDetails: "", nomineeNotes: "" }
      ]
    });
  };

  // Function to remove a nominee block
  const removeNominee = (index) => {
    const updatedNominees = formData.nominees.filter((_, i) => i !== index);
    setFormData({ ...formData, nominees: updatedNominees });
  };
  // const handleNext = async () => {
  //   if (activeStep === 0 && (!formData.customerName || !formData.phone)) {
  //     Swal.fire("Wait!", "Name and Phone are required.", "warning");
  //     return;
  //   }
  //   if (await saveToBackend(false)) setActiveStep((prev) => prev + 1);
  // };

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
            <NomineeDetails
              formData={formData}
              // YOU WERE MISSING THESE THREE PROPS:
              handleNomineeChange={handleNomineeChange}
              addNominee={addNominee}
              removeNominee={removeNominee}
            />
          )}
          {activeStep === 2 && (
            <DocumentUpload
              handleFileChange={handleFileChange}
              handleNomineeFileChange={handleNomineeFileChange} // NAYA PROP
              files={files}
              nomineesData={formData.nominees} // NAYA PROP (kitne block dikhane hain ye batane ke liye)
            />
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
