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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CustomerDetails from "./CustomerDetails";
import NomineeDetails from "./NomineeDetails";
import DocumentUpload from "./DocumentUpload";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = "https://shreeinvestment.in/api/";
const steps = ["Customer Details", "Nominee & Bank", "Upload Documents"];

const emptyNominee = () => ({
  nomineeName: "",
  nomineeRelation: "",
  nomineeId: "",
  nomineeContact: "",
  nomineeEmail: "",
});

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
    nominees: [emptyNominee()],
  });

  const [files, setFiles] = useState({
    idProof: null,
    photo: null,
    panDoc: null,
    bankDoc: null,
    nominees: [],
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleNomineeChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      nominees: prev.nominees.map((nom, i) =>
        i === index ? { ...nom, [name]: value } : nom
      ),
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleNomineeFileChange = (e, fieldName, nomineeIndex) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => {
      const updated = [...prev.nominees];
      updated[nomineeIndex] = { ...(updated[nomineeIndex] || {}), [fieldName]: file };
      return { ...prev, nominees: updated };
    });
  };

  const addNominee = () => {
    setFormData((prev) => ({
      ...prev,
      nominees: [...prev.nominees, emptyNominee()],
    }));
  };

  const removeNominee = (index) => {
    setFormData((prev) => ({
      ...prev,
      nominees: prev.nominees.filter((_, i) => i !== index),
    }));
    setFiles((prev) => ({
      ...prev,
      nominees: prev.nominees.filter((_, i) => i !== index),
    }));
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const validateStep = (step) => {
    if (step === 0) {
      if (!formData.customerName.trim()) {
        Swal.fire("Required", "Customer name is required.", "warning");
        return false;
      }
      if (!formData.phone.trim()) {
        Swal.fire("Required", "Phone number is required.", "warning");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    setActiveStep((prev) => prev + 1);
  };

  const buildFormData = (confirmDuplicate) => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "nominees") {
        const arr = Array.isArray(formData.nominees) ? formData.nominees : [];
        data.append("nominees", JSON.stringify(arr));
      } else {
        data.append(key, formData[key] ?? "");
      }
    });

    if (confirmDuplicate) data.append("confirmDuplicate", "1");

    if (files.idProof) data.append("idProof", files.idProof);
    if (files.photo) data.append("photo", files.photo);
    if (files.panDoc) data.append("panDoc", files.panDoc);
    if (files.bankDoc) data.append("bankDoc", files.bankDoc);

    (files.nominees || []).forEach((nomFiles, index) => {
      if (!nomFiles || typeof nomFiles !== "object") return;
      if (nomFiles.nomineeIdProof)
        data.append(`nomineeIdProof_${index}`, nomFiles.nomineeIdProof);
      if (nomFiles.nomineePhoto)
        data.append(`nomineePhoto_${index}`, nomFiles.nomineePhoto);
      if (nomFiles.nomineePanDoc)
        data.append(`nomineePanDoc_${index}`, nomFiles.nomineePanDoc);
      if (nomFiles.nomineeBankDoc)
        data.append(`nomineeBankDoc_${index}`, nomFiles.nomineeBankDoc);
    });

    return data;
  };

  const submitApplication = async (confirmDuplicate = false) => {
    if (loading) return false;
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}submit_form.php`,
        buildFormData(confirmDuplicate)
      );

      setLoading(false);

      if (res.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Saved",
          text: "The application was submitted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/customer-list");
        return true;
      }

      Swal.fire({
        icon: "error",
        title: "Not Saved",
        text: res.data?.message || "Unable to save the record. Please try again.",
      });
      return false;
    } catch (err) {
      setLoading(false);

      const resp = err.response;
      if (resp?.status === 409 && resp.data?.status === "duplicate_warning") {
        const existing = Array.isArray(resp.data.existing) ? resp.data.existing : [];
        const listHtml = existing
          .map(
            (c) =>
              `<li style="margin-bottom:6px"><b>${c.customer_name || "-"}</b>` +
              `<br/><small>PAN: ${c.pan_number || "N/A"} &nbsp;|&nbsp; Registered: ${
                c.created_at ? String(c.created_at).slice(0, 10) : "N/A"
              }</small></li>`
          )
          .join("");

        const confirm = await Swal.fire({
          icon: "warning",
          title: "Duplicate Phone Number",
          html:
            `<p style="text-align:left;margin-bottom:8px">The number ` +
            `<b>${formData.phone}</b> is already registered to the following ` +
            `${existing.length === 1 ? "customer" : "customers"}:</p>` +
            `<ul style="text-align:left;padding-left:20px">${listHtml}</ul>` +
            `<p style="text-align:left;margin-top:12px">If this applicant is a ` +
            `different member of the same household, select <b>Continue</b>. ` +
            `Otherwise, cancel and verify the number.</p>`,
          showCancelButton: true,
          confirmButtonText: "Continue Anyway",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#004c8f",
          width: 600,
        });

        if (confirm.isConfirmed) {
          return submitApplication(true);
        }
        return false;
      }

      let msg = "Unable to reach the server. Please check your connection.";
      if (resp) {
        msg = resp.data?.message || `Server error (${resp.status}).`;
      }
      Swal.fire({ icon: "error", title: "Error", text: msg });
      return false;
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Box>
      <Backdrop sx={{ color: "#fff", zIndex: 2000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

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
              handleNomineeChange={handleNomineeChange}
              addNominee={addNominee}
              removeNominee={removeNominee}
            />
          )}
          {activeStep === 2 && (
            <DocumentUpload
              handleFileChange={handleFileChange}
              handleNomineeFileChange={handleNomineeFileChange}
              files={files}
              nomineesData={formData.nominees}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button disabled={activeStep === 0 || loading} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={isLastStep ? () => submitApplication(false) : handleNext}
          >
            {isLastStep ? "Finish & Submit" : "Save & Next"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OnboardingForm;