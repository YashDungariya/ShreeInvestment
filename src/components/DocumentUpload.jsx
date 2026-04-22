// import React, { useState } from "react";
// import { Typography, Box, Button, Stack, Tabs, Tab } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import PersonIcon from "@mui/icons-material/Person";
// import GroupIcon from "@mui/icons-material/Group";

// const DocumentUpload = ({ handleFileChange, files }) => {
//   const [tabValue, setTabValue] = useState(0);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   // Label style consistent with other forms
//   const LabelStyle = {
//     fontWeight: "bold",
//     color: "#000",
//     mb: 1,
//     display: "block",
//     fontSize: "0.9rem",
//   };

//   // Small, Compact and Professional Upload Button Style
//   const UploadButtonStyle = {
//     bgcolor: "#ff8c00",
//     color: "white",
//     width: "fit-content",
//     px: 2,
//     py: 0.5,
//     borderRadius: "4px",
//     textTransform: "none",
//     fontWeight: "bold",
//     fontSize: "0.75rem",
//     "&:hover": { bgcolor: "#e67e00" },
//     boxShadow: "none",
//   };

//   return (
//     <Box sx={{ p: 1, width: "100%" }}>
//       {/* Required Note at Top */}
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="body2" sx={{ color: "red", fontStyle: "italic", fontWeight: "bold" }}>
//           NOTE: Please upload clear documents for verification *
//         </Typography>
//       </Box>

//       {/* Tabs for Customer and Nominee */}
//       <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           TabIndicatorProps={{ style: { backgroundColor: "#004c8f", height: "3px" } }}
//           sx={{ "& .Mui-selected": { color: "#004c8f !important", fontWeight: "bold" } }}
//         >
//           <Tab icon={<PersonIcon />} iconPosition="start" label="Customer Documents" />
//           <Tab icon={<GroupIcon />} iconPosition="start" label="Nominee Documents" />
//         </Tabs>
//       </Box>

//       {/* ================= TAB 0: CUSTOMER DOCUMENTS ================= */}
//       {tabValue === 0 && (
//         <Stack spacing={4}>
//           <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={LabelStyle}>Aadhaar Card (Front & Back) *</Typography>
//               <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
//                 Upload Aadhaar
//                 <input type="file" hidden onChange={(e) => handleFileChange(e, "idProof")} />
//               </Button>
//               <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
//                 {files.idProof ? `Selected: ${files.idProof.name}` : "*PDF or JPG preferred"}
//               </Typography>
//             </Box>

//             <Box sx={{ flex: 1 }}>
//               <Typography sx={LabelStyle}>Passport Size Photo *</Typography>
//               <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
//                 Upload Photo
//                 <input type="file" hidden onChange={(e) => handleFileChange(e, "photo")} />
//               </Button>
//               <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
//                 {files.photo ? `Selected: ${files.photo.name}` : "*Please upload most recent photo"}
//               </Typography>
//             </Box>
//           </Stack>

//           <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={LabelStyle}>PAN Card Copy</Typography>
//               <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
//                 Upload PAN
//                 <input type="file" hidden onChange={(e) => handleFileChange(e, "panDoc")} />
//               </Button>
//               <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
//                 {files.panDoc ? `Selected: ${files.panDoc.name}` : "*Upload PAN for tax purposes"}
//               </Typography>
//             </Box>

//             <Box sx={{ flex: 1 }}>
//               <Typography sx={LabelStyle}>Bank Passbook / Cheque</Typography>
//               <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
//                 Upload Bank Doc
//                 <input type="file" hidden onChange={(e) => handleFileChange(e, "bankDoc")} />
//               </Button>
//               <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
//                 {files.bankDoc ? `Selected: ${files.bankDoc.name}` : "*Upload preferred bank document"}
//               </Typography>
//             </Box>
//           </Stack>
//         </Stack>
//       )}

//       {/* ================= TAB 1: NOMINEE DOCUMENTS ================= */}
//       {tabValue === 1 && (
//         <Stack spacing={4}>
//           <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={LabelStyle}>Nominee Aadhaar / ID Proof *</Typography>
//               <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
//                 Upload Nominee ID
//                 <input type="file" hidden onChange={(e) => handleFileChange(e, "nomineeIdProof")} />
//               </Button>
//               <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
//                 {files.nomineeIdProof ? `Selected: ${files.nomineeIdProof.name}` : "*PDF or JPG preferred"}
//               </Typography>
//             </Box>

//             <Box sx={{ flex: 1 }}>
//               <Typography sx={LabelStyle}>Nominee Photo *</Typography>
//               <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
//                 Upload Nominee Photo
//                 <input type="file" hidden onChange={(e) => handleFileChange(e, "nomineePhoto")} />
//               </Button>
//               <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
//                 {files.nomineePhoto ? `Selected: ${files.nomineePhoto.name}` : "*Please upload most recent photo"}
//               </Typography>
//             </Box>
//           </Stack>

//           <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={LabelStyle}>Nominee PAN Card Copy</Typography>
//               <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
//                 Upload Nominee PAN
//                 <input type="file" hidden onChange={(e) => handleFileChange(e, "nomineePanDoc")} />
//               </Button>
//               <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
//                 {files.nomineePanDoc ? `Selected: ${files.nomineePanDoc.name}` : "*Optional but recommended"}
//               </Typography>
//             </Box>

//             <Box sx={{ flex: 1 }}>
//               <Typography sx={LabelStyle}>Nominee Bank Proof</Typography>
//               <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
//                 Upload Nominee Bank
//                 <input type="file" hidden onChange={(e) => handleFileChange(e, "nomineeBankDoc")} />
//               </Button>
//               <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
//                 {files.nomineeBankDoc ? `Selected: ${files.nomineeBankDoc.name}` : "*Optional"}
//               </Typography>
//             </Box>
//           </Stack>
//         </Stack>
//       )}

//     </Box>
//   );
// };

// export default DocumentUpload;
import React, { useState } from "react";
import { Typography, Box, Button, Stack, Tabs, Tab, Divider } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";

// NOTE: Naye props add kiye hain: nomineesData aur handleNomineeFileChange
const DocumentUpload = ({ handleFileChange, handleNomineeFileChange, files, nomineesData }) => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const LabelStyle = { fontWeight: "bold", color: "#000", mb: 1, display: "block", fontSize: "0.9rem" };
  const UploadButtonStyle = { bgcolor: "#ff8c00", color: "white", width: "fit-content", px: 2, py: 0.5, borderRadius: "4px", textTransform: "none", fontWeight: "bold", fontSize: "0.75rem", "&:hover": { bgcolor: "#e67e00" }, boxShadow: "none" };

  // Safe checks
  const safeNominees = nomineesData || [];
  const safeNomineeFiles = files?.nominees || [];

  return (
    <Box sx={{ p: 1, width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: "red", fontStyle: "italic", fontWeight: "bold" }}>
          NOTE: Please upload clear documents for verification *
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{ style: { backgroundColor: "#004c8f", height: "3px" } }} sx={{ "& .Mui-selected": { color: "#004c8f !important", fontWeight: "bold" } }}>
          <Tab icon={<PersonIcon />} iconPosition="start" label="Customer Documents" />
          <Tab icon={<GroupIcon />} iconPosition="start" label={`Nominee Documents (${safeNominees.length})`} />
        </Tabs>
      </Box>

      {/* ================= TAB 0: CUSTOMER DOCUMENTS (SAME AS BEFORE) ================= */}
      {tabValue === 0 && (
        <Stack spacing={4}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={LabelStyle}>Aadhaar Card (Front & Back) *</Typography>
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
                Upload Aadhaar
                <input type="file" hidden onChange={(e) => handleFileChange(e, "idProof")} />
              </Button>
              <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
                {files?.idProof ? `Selected: ${files.idProof.name}` : "*PDF or JPG preferred"}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={LabelStyle}>Passport Size Photo *</Typography>
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
                Upload Photo
                <input type="file" hidden onChange={(e) => handleFileChange(e, "photo")} />
              </Button>
              <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
                {files?.photo ? `Selected: ${files.photo.name}` : "*Please upload most recent photo"}
              </Typography>
            </Box>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={LabelStyle}>PAN Card Copy</Typography>
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
                Upload PAN
                <input type="file" hidden onChange={(e) => handleFileChange(e, "panDoc")} />
              </Button>
              <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
                {files?.panDoc ? `Selected: ${files.panDoc.name}` : "*Upload PAN for tax purposes"}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={LabelStyle}>Bank Passbook / Cheque</Typography>
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
                Upload Bank Doc
                <input type="file" hidden onChange={(e) => handleFileChange(e, "bankDoc")} />
              </Button>
              <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
                {files?.bankDoc ? `Selected: ${files.bankDoc.name}` : "*Upload preferred bank document"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      )}

      {/* ================= TAB 1: NOMINEE DOCUMENTS (DYNAMIC LOOP) ================= */}
      {tabValue === 1 && (
        <Box>
          {safeNominees.length === 0 && (
            <Typography sx={{ color: 'gray' }}>Please add a nominee in the previous step first.</Typography>
          )}

          {safeNominees.map((nominee, index) => {
            // Get files specifically for this index
            const currentNomFiles = safeNomineeFiles[index] || {};

            return (
              <Box key={index} sx={{ mb: 5 }}>
                <Typography variant="h6" sx={{ color: "#004c8f", fontWeight: "bold", mb: 2 }}>
                  Documents for Nominee {index + 1} {nominee.nomineeName ? `(${nominee.nomineeName})` : ''}
                </Typography>

                <Stack spacing={4}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={LabelStyle}>Aadhaar / ID Proof *</Typography>
                      <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
                        Upload ID
                        <input type="file" hidden onChange={(e) => handleNomineeFileChange(e, "nomineeIdProof", index)} />
                      </Button>
                      <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
                        {currentNomFiles.nomineeIdProof ? `Selected: ${currentNomFiles.nomineeIdProof.name}` : "*PDF or JPG preferred"}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography sx={LabelStyle}>Photo *</Typography>
                      <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
                        Upload Photo
                        <input type="file" hidden onChange={(e) => handleNomineeFileChange(e, "nomineePhoto", index)} />
                      </Button>
                      <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
                        {currentNomFiles.nomineePhoto ? `Selected: ${currentNomFiles.nomineePhoto.name}` : "*Recent photo"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={LabelStyle}>PAN Card Copy</Typography>
                      <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
                        Upload PAN
                        <input type="file" hidden onChange={(e) => handleNomineeFileChange(e, "nomineePanDoc", index)} />
                      </Button>
                      <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
                        {currentNomFiles.nomineePanDoc ? `Selected: ${currentNomFiles.nomineePanDoc.name}` : "*Optional but recommended"}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography sx={LabelStyle}>Bank Proof</Typography>
                      <Button variant="contained" component="label" startIcon={<CloudUploadIcon sx={{ fontSize: "1rem !important" }} />} sx={UploadButtonStyle}>
                        Upload Bank
                        <input type="file" hidden onChange={(e) => handleNomineeFileChange(e, "nomineeBankDoc", index)} />
                      </Button>
                      <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "gray", fontSize: "0.7rem" }}>
                        {currentNomFiles.nomineeBankDoc ? `Selected: ${currentNomFiles.nomineeBankDoc.name}` : "*Optional"}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                {index !== safeNominees.length - 1 && <Divider sx={{ my: 4 }} />}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default DocumentUpload;