import React from "react";
import { TextField, Typography, Box, Stack, Button, Paper, Divider, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";


const NomineeDetails = ({ formData, handleNomineeChange, addNominee, removeNominee }) => {
  const LabelStyle = {
    fontWeight: "bold",
    color: "#000",
    mb: 1,
    display: "block",
    fontSize: "0.9rem",
    textAlign: "left",
  };

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

  // Safe check in case formData.nominees is undefined initially
  const nominees = formData.nominees || [];

  return (
    <Box sx={{ p: 1, width: "100%" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="body2" sx={{ color: "red", fontStyle: "italic", fontWeight: "bold" }}>
          NOTE: Please fill necessary fields marked *
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addNominee}
          sx={{ color: "#004c8f", borderColor: "#004c8f", fontWeight: "bold" }}
        >
          Add Another Nominee
        </Button>
      </Box>

      {nominees.map((nominee, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            bgcolor: "#fafcff"
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f" }}>
              Nominee {index + 1}
            </Typography>

            {/* Show remove button only if there is more than 1 nominee */}
            {nominees.length > 1 && (
              <IconButton color="error" onClick={() => removeNominee(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />

          {/* Row 1 */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 4, width: "100%" }}>
            <Box sx={{ flex: 1, minWidth: "300px" }}>
              <Typography sx={LabelStyle}>Nominee Name *</Typography>
              <TextField
                placeholder="Nominee's full name"
                name="nomineeName"
                value={nominee.nomineeName || ""}
                onChange={(e) => handleNomineeChange(index, e)}
                size="small"
                sx={InputStyle}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: "300px" }}>
              <Typography sx={LabelStyle}>Nominee Relationship *</Typography>
              <TextField
                placeholder="e.g. Spouse, Father"
                name="nomineeRelation"
                value={nominee.nomineeRelation || ""}
                onChange={(e) => handleNomineeChange(index, e)}
                size="small"
                sx={InputStyle}
              />
            </Box>
          </Stack>

          {/* Row 2 */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 4, width: "100%" }}>
            <Box sx={{ flex: 1, minWidth: "300px" }}>
              <Typography sx={LabelStyle}>Nominee PAN / Aadhaar</Typography>
              <TextField
                placeholder="Enter ID Number"
                name="nomineeId"
                value={nominee.nomineeId || ""}
                onChange={(e) => handleNomineeChange(index, e)}
                size="small"
                sx={InputStyle}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: "300px" }}>
              <Typography sx={LabelStyle}>Nominee Contact Number</Typography>
              <TextField
                placeholder="Phone Number"
                name="nomineeContact"
                value={nominee.nomineeContact || ""}
                onChange={(e) => handleNomineeChange(index, e)}
                size="small"
                sx={InputStyle}
              />
            </Box>
          </Stack>

          {/* Row 3 */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 4, width: "100%" }}>
            <Box sx={{ flex: 1, minWidth: "300px" }}>
              <Typography sx={LabelStyle}>Nominee Email ID</Typography>
              <TextField
                placeholder="email@example.com"
                name="nomineeEmail"
                value={nominee.nomineeEmail || ""}
                onChange={(e) => handleNomineeChange(index, e)}
                size="small"
                sx={InputStyle}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: "300px" }}>
              <Typography sx={LabelStyle}>Bank Details (Cheque / Passbook)</Typography>
              <TextField
                placeholder="Account No, IFSC, Bank Name"
                name="bankDetails"
                value={nominee.bankDetails || ""}
                onChange={(e) => handleNomineeChange(index, e)}
                size="small"
                sx={InputStyle}
              />
            </Box>
          </Stack>

          {/* Row 4 */}
          <Box sx={{ width: "100%" }}>
            <Typography sx={LabelStyle}>Nominee Dynamic Notes</Typography>
            <TextField
              multiline
              minRows={3}
              placeholder="Enter additional information about nominee here..."
              name="nomineeNotes"
              value={nominee.nomineeNotes || ""}
              onChange={(e) => handleNomineeChange(index, e)}
              size="small"
              sx={InputStyle}
            />
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default NomineeDetails;