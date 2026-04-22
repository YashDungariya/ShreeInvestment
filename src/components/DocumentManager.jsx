// import React, { useEffect, useState } from "react";
// import {
//   Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, TextField, InputAdornment, Typography, Chip, IconButton, Stack, Avatar,
//   Tabs, Tab,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import SearchIcon from "@mui/icons-material/Search";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import PersonIcon from "@mui/icons-material/Person";
// import GroupIcon from "@mui/icons-material/Group";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";

// const DocumentManager = () => {
//   const navigate = useNavigate();
//   const [customers, setCustomers] = useState([]);
//   const [nomineesList, setNomineesList] = useState([]); // Nayi state Nominees ke liye
//   const [searchTerm, setSearchTerm] = useState("");
//   const [tabValue, setTabValue] = useState(0);

//   const API_BASE = "https://shreeinvestment.in/api/";

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}get_customers.php`);
//       const allCustomers = res.data;
//       setCustomers(allCustomers);

//       // NAYA LOGIC: Saare customers ke andar se unke nominees nikal kar ek flat list banayein
//       let allNomineesFlat = [];
//       allCustomers.forEach(customer => {
//         if (customer.nominees && customer.nominees.length > 0) {
//           customer.nominees.forEach(nom => {
//             // Customer ka naam aur phone bhi nominee ke object me attach kar do, taki UI me dikhe
//             allNomineesFlat.push({
//               ...nom,
//               parent_customer_name: customer.customer_name,
//               parent_customer_phone: customer.phone
//             });
//           });
//         }
//       });
//       setNomineesList(allNomineesFlat);

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleUploadDoc = async (id, docType, isUpdate = false, isNominee = false) => {
//     const { value: file } = await Swal.fire({
//       title: isUpdate ? `Update Document` : `Upload Document`,
//       input: "file",
//       inputAttributes: { accept: "image/*,application/pdf" },
//       showCancelButton: true,
//       confirmButtonColor: "#004c8f",
//     });

//     if (file) {
//       const formData = new FormData();
//       formData.append("id", id);
//       formData.append("docType", docType);
//       formData.append("newFile", file);
      
//       // Backend ko batana padega ki table kaunsi update karni hai
//       formData.append("isNominee", isNominee ? "true" : "false"); 

//       try {
//         const res = await axios.post(`${API_BASE}update_document.php`, formData);
//         if (res.data.status === "success") {
//           Swal.fire("Success!", "File saved.", "success");
//           fetchData();
//         } else {
//           Swal.fire("Error", res.data.message || "Upload failed", "error");
//         }
//       } catch (err) {
//         Swal.fire("Error", "Upload failed", "error");
//       }
//     }
//   };

//   const handleDeleteDoc = async (id, docType, isNominee = false) => {
//     const result = await Swal.fire({
//       title: "Delete document?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//     });
//     if (result.isConfirmed) {
//       try {
//         const res = await axios.post(`${API_BASE}clear_document.php`, {
//           id,
//           docType,
//           isNominee: isNominee
//         });
//         if (res.data.status === "success") {
//           fetchData();
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   // Searching logic updated for both arrays
//   const filteredCustomers = customers.filter((c) =>
//     c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     c.phone?.includes(searchTerm)
//   );

//   const filteredNominees = nomineesList.filter((n) =>
//     n.nominee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     n.parent_customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     n.parent_customer_phone?.includes(searchTerm)
//   );

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const RenderDocCell = (row, type, label, isNominee = false) => {
//     const file = row[type];
//     if (!file) {
//       return (
//         <Button
//           size="small"
//           startIcon={<CloudUploadIcon />}
//           onClick={() => handleUploadDoc(row.id, type, false, isNominee)}
//           sx={{ color: "#94a3b8", textTransform: "none", fontSize: "12px", border: "1px dashed #cbd5e1", borderRadius: "8px", width: "100px" }}
//         >
//           Upload
//         </Button>
//       );
//     }
//     return (
//       <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f8fafc", borderRadius: "8px", p: "4px 8px", width: "fit-content", border: "1px solid #e2e8f0" }}>
//         <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", mr: 1 }}>{label}</Typography>
//         <Stack direction="row" spacing={0}>
//           <IconButton size="small" onClick={() => window.open(`${API_BASE}uploads/${file}`)} color="primary"><VisibilityIcon sx={{ fontSize: 16 }} /></IconButton>
//           <IconButton size="small" onClick={() => handleUploadDoc(row.id, type, true, isNominee)} color="warning"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
//           <IconButton size="small" onClick={() => handleDeleteDoc(row.id, type, isNominee)} color="error"><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
//         </Stack>
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ p: 3, bgcolor: "#f4f7fa", minHeight: "100vh" }}>
//       <Box sx={{ mb: 2 }}>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard")} sx={{ color: "#475569", fontWeight: "bold" }}>
//           Back to Dashboard
//         </Button>
//       </Box>

//       <TextField
//         fullWidth
//         placeholder="Search customers or nominees..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         sx={{ mb: 4, bgcolor: "white", borderRadius: "12px", "& fieldset": { border: "none" }, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
//         InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "#004c8f" }} /></InputAdornment>) }}
//       />

//       <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
//         <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{ style: { backgroundColor: "#004c8f", height: "3px" } }} sx={{ "& .Mui-selected": { color: "#004c8f !important", fontWeight: "bold" } }}>
//           <Tab icon={<PersonIcon />} iconPosition="start" label={`Customer Documents (${filteredCustomers.length})`} />
//           <Tab icon={<GroupIcon />} iconPosition="start" label={`Nominee Documents (${filteredNominees.length})`} />
//         </Tabs>
//       </Box>

//       <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0" }}>
//         <Table>
//           <TableHead sx={{ bgcolor: "#f8fafc" }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>{tabValue === 0 ? "CUSTOMER" : "NOMINEE (FOR CUSTOMER)"}</TableCell>
//               <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>ID PROOF</TableCell>
//               <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>PAN</TableCell>
//               <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>BANK</TableCell>
//               <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>PHOTO</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 800, color: "#64748b" }}>STATUS</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {/* =============== CUSTOMER TAB =============== */}
//             {tabValue === 0 && filteredCustomers.map((row) => (
//               <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
//                 <TableCell>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <Avatar sx={{ bgcolor: "#004c8f", fontSize: "14px" }}>{row.customer_name?.charAt(0)}</Avatar>
//                     <Box>
//                       <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{row.customer_name}</Typography>
//                       <Typography variant="caption" sx={{ color: "#64748b" }}>{row.phone}</Typography>
//                     </Box>
//                   </Box>
//                 </TableCell>
//                 <TableCell>{RenderDocCell(row, "doc_id_proof", "ID", false)}</TableCell>
//                 <TableCell>{RenderDocCell(row, "doc_pan", "PAN", false)}</TableCell>
//                 <TableCell>{RenderDocCell(row, "doc_bank", "BNK", false)}</TableCell>
//                 <TableCell>{RenderDocCell(row, "doc_photo", "IMG", false)}</TableCell>
//                 <TableCell align="center">
//                   <Chip
//                     label={row.doc_id_proof && row.doc_pan && row.doc_bank && row.doc_photo ? "Done" : "Pending"}
//                     size="small"
//                     sx={{ fontWeight: 900, bgcolor: row.doc_id_proof && row.doc_pan && row.doc_bank && row.doc_photo ? "#dcfce7" : "#fee2e2", color: row.doc_id_proof && row.doc_pan && row.doc_bank && row.doc_photo ? "#166534" : "#991b1b" }}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}

//             {/* =============== NOMINEE TAB =============== */}
//             {tabValue === 1 && filteredNominees.map((row) => (
//               <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
//                 <TableCell>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <Avatar sx={{ bgcolor: "#ff8c00", fontSize: "14px" }}>{row.nominee_name?.charAt(0) || "N"}</Avatar>
//                     <Box>
//                       <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ff8c00" }}>{row.nominee_name}</Typography>
//                       <Typography variant="caption" sx={{ color: "#64748b" }}>For: {row.parent_customer_name}</Typography>
//                     </Box>
//                   </Box>
//                 </TableCell>
//                 <TableCell>{RenderDocCell(row, "nominee_doc_id_proof", "ID", true)}</TableCell>
//                 <TableCell>{RenderDocCell(row, "nominee_doc_pan", "PAN", true)}</TableCell>
//                 <TableCell>{RenderDocCell(row, "nominee_doc_bank", "BNK", true)}</TableCell>
//                 <TableCell>{RenderDocCell(row, "nominee_doc_photo", "IMG", true)}</TableCell>
//                 <TableCell align="center">
//                   <Chip
//                     label={row.nominee_doc_id_proof && row.nominee_doc_photo ? "Done" : "Pending"}
//                     size="small"
//                     sx={{ fontWeight: 900, bgcolor: row.nominee_doc_id_proof && row.nominee_doc_photo ? "#dcfce7" : "#fee2e2", color: row.nominee_doc_id_proof && row.nominee_doc_photo ? "#166534" : "#991b1b" }}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}

//             {((tabValue === 0 && filteredCustomers.length === 0) || (tabValue === 1 && filteredNominees.length === 0)) && (
//               <TableRow>
//                 <TableCell colSpan={6} align="center" sx={{ py: 4, color: "gray" }}>No records found</TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default DocumentManager;

import React, { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Typography, Chip, IconButton, Stack, Avatar,
  Tabs, Tab, TablePagination
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const DocumentManager = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [nomineesList, setNomineesList] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const API_BASE = "https://shreeinvestment.in/api/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}get_customers.php`);
      const allCustomers = res.data;
      setCustomers(allCustomers);

      let allNomineesFlat = [];
      allCustomers.forEach(customer => {
        if (customer.nominees && customer.nominees.length > 0) {
          customer.nominees.forEach(nom => {
            allNomineesFlat.push({
              ...nom,
              parent_customer_name: customer.customer_name,
              parent_customer_phone: customer.phone
            });
          });
        }
      });
      setNomineesList(allNomineesFlat);

    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadDoc = async (id, docType, isUpdate = false, isNominee = false) => {
    const { value: file } = await Swal.fire({
      title: isUpdate ? `Update Document` : `Upload Document`,
      input: "file",
      inputAttributes: { accept: "image/*,application/pdf" },
      showCancelButton: true,
      confirmButtonColor: "#004c8f",
    });

    if (file) {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("docType", docType);
      formData.append("newFile", file);
      formData.append("isNominee", isNominee ? "true" : "false"); 

      try {
        const res = await axios.post(`${API_BASE}update_document.php`, formData);
        if (res.data.status === "success") {
          Swal.fire("Success!", "File saved.", "success");
          fetchData();
        } else {
          Swal.fire("Error", res.data.message || "Upload failed", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Upload failed", "error");
      }
    }
  };

  const handleDeleteDoc = async (id, docType, isNominee = false) => {
    const result = await Swal.fire({
      title: "Delete document?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });
    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${API_BASE}clear_document.php`, {
          id,
          docType,
          isNominee: isNominee
        });
        if (res.data.status === "success") {
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Search Logic
  const filteredCustomers = customers.filter((c) =>
    c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  const filteredNominees = nomineesList.filter((n) =>
    n.nominee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.parent_customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.parent_customer_phone?.includes(searchTerm)
  );

  // Tab & Search change hone par pagination reset karein
  useEffect(() => {
    setPage(0);
  }, [searchTerm, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate Paginated Data
  const paginatedCustomers = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const paginatedNominees = filteredNominees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const RenderDocCell = (row, type, label, isNominee = false) => {
    const file = row[type];
    if (!file) {
      return (
        <Button
          size="small"
          startIcon={<CloudUploadIcon />}
          onClick={() => handleUploadDoc(row.id, type, false, isNominee)}
          sx={{ color: "#94a3b8", textTransform: "none", fontSize: "12px", border: "1px dashed #cbd5e1", borderRadius: "8px", width: "100px" }}
        >
          Upload
        </Button>
      );
    }
    return (
      <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f8fafc", borderRadius: "8px", p: "4px 8px", width: "fit-content", border: "1px solid #e2e8f0" }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", mr: 1 }}>{label}</Typography>
        <Stack direction="row" spacing={0}>
          <IconButton size="small" onClick={() => window.open(`${API_BASE}uploads/${file}`)} color="primary"><VisibilityIcon sx={{ fontSize: 16 }} /></IconButton>
          <IconButton size="small" onClick={() => handleUploadDoc(row.id, type, true, isNominee)} color="warning"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
          <IconButton size="small" onClick={() => handleDeleteDoc(row.id, type, isNominee)} color="error"><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f7fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard")} sx={{ color: "#475569", fontWeight: "bold" }}>
          Back to Dashboard
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search customers or nominees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4, bgcolor: "white", borderRadius: "12px", "& fieldset": { border: "none" }, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "#004c8f" }} /></InputAdornment>) }}
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{ style: { backgroundColor: "#004c8f", height: "3px" } }} sx={{ "& .Mui-selected": { color: "#004c8f !important", fontWeight: "bold" } }}>
          <Tab icon={<PersonIcon />} iconPosition="start" label={`Customer Documents (${filteredCustomers.length})`} />
          <Tab icon={<GroupIcon />} iconPosition="start" label={`Nominee Documents (${filteredNominees.length})`} />
        </Tabs>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>{tabValue === 0 ? "CUSTOMER" : "NOMINEE (FOR CUSTOMER)"}</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>ID PROOF</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>PAN</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>BANK</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>PHOTO</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, color: "#64748b" }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* =============== CUSTOMER TAB =============== */}
            {tabValue === 0 && paginatedCustomers.map((row) => (
              <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#004c8f", fontSize: "14px" }}>{row.customer_name?.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{row.customer_name}</Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>{row.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{RenderDocCell(row, "doc_id_proof", "ID", false)}</TableCell>
                <TableCell>{RenderDocCell(row, "doc_pan", "PAN", false)}</TableCell>
                <TableCell>{RenderDocCell(row, "doc_bank", "BNK", false)}</TableCell>
                <TableCell>{RenderDocCell(row, "doc_photo", "IMG", false)}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.doc_id_proof && row.doc_pan && row.doc_bank && row.doc_photo ? "Done" : "Pending"}
                    size="small"
                    sx={{ fontWeight: 900, bgcolor: row.doc_id_proof && row.doc_pan && row.doc_bank && row.doc_photo ? "#dcfce7" : "#fee2e2", color: row.doc_id_proof && row.doc_pan && row.doc_bank && row.doc_photo ? "#166534" : "#991b1b" }}
                  />
                </TableCell>
              </TableRow>
            ))}

            {/* =============== NOMINEE TAB =============== */}
            {tabValue === 1 && paginatedNominees.map((row) => (
              <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#ff8c00", fontSize: "14px" }}>{row.nominee_name?.charAt(0) || "N"}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ff8c00" }}>{row.nominee_name}</Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>For: {row.parent_customer_name}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{RenderDocCell(row, "nominee_doc_id_proof", "ID", true)}</TableCell>
                <TableCell>{RenderDocCell(row, "nominee_doc_pan", "PAN", true)}</TableCell>
                <TableCell>{RenderDocCell(row, "nominee_doc_bank", "BNK", true)}</TableCell>
                <TableCell>{RenderDocCell(row, "nominee_doc_photo", "IMG", true)}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.nominee_doc_id_proof && row.nominee_doc_photo ? "Done" : "Pending"}
                    size="small"
                    sx={{ fontWeight: 900, bgcolor: row.nominee_doc_id_proof && row.nominee_doc_photo ? "#dcfce7" : "#fee2e2", color: row.nominee_doc_id_proof && row.nominee_doc_photo ? "#166534" : "#991b1b" }}
                  />
                </TableCell>
              </TableRow>
            ))}

            {((tabValue === 0 && paginatedCustomers.length === 0) || (tabValue === 1 && paginatedNominees.length === 0)) && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "gray" }}>No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Component */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={tabValue === 0 ? filteredCustomers.length : filteredNominees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid #e2e8f0" }}
        />
      </TableContainer>
    </Box>
  );
};

export default DocumentManager;