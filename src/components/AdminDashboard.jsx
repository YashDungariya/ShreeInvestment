// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Typography,
//   Box,
//   Chip,
//   Tooltip,
//   Checkbox,
//   IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import Swal from "sweetalert2";

// const AdminDashboard = () => {
//   const [customers, setCustomers] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const API_BASE =
//     "https://lightyellow-mole-663257.hostingersite.com/api/uploads/";

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         "https://lightyellow-mole-663257.hostingersite.com/api/get_customers.php",
//       );
//       setCustomers(res.data);
//     } catch (err) {
//       console.error("Data fetch error", err);
//     }
//   };

//   const handleDelete = async (idsToDelete) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: `You want to delete ${idsToDelete.length} record(s)?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await axios.post(
//           "https://lightyellow-mole-663257.hostingersite.com/api/delete_customers.php",
//           { ids: idsToDelete },
//         );

//         if (res.data.status === "success") {
//           Swal.fire("Deleted!", res.data.message, "success");
//           setSelectedIds([]);
//           fetchData();
//         }
//       } catch (err) {
//         Swal.fire("Error", "Failed to delete records", "error");
//       }
//     }
//   };

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedIds(customers.map((n) => n.id));
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   const HeaderStyle = {
//     bgcolor: "#004c8f",
//     "& th": {
//       color: "white",
//       fontWeight: "bold",
//       fontSize: "0.90rem",
//       whiteSpace: "nowrap",
//     },
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f7fa", minHeight: "100vh" }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           mb: 3,
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h5" sx={{ fontWeight: "bold", color: "#003366" }}>
//           CUSTOMER APPLICATIONS PORTAL
//         </Typography>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           {selectedIds.length > 0 && (
//             <Button
//               variant="contained"
//               color="error"
//               startIcon={<DeleteIcon />}
//               onClick={() => handleDelete(selectedIds)}
//             >
//               Delete Selected ({selectedIds.length})
//             </Button>
//           )}
//           <Chip
//             label={`Total: ${customers.length}`}
//             color="primary"
//             variant="outlined"
//           />
//         </Box>
//       </Box>

//       <TableContainer
//         component={Paper}
//         sx={{ borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
//       >
//         <Table sx={{ minWidth: 2800 }}>
//           <TableHead sx={HeaderStyle}>
//             <TableRow>
//               <TableCell align="center">
//                 <Checkbox
//                   color="secondary"
//                   indeterminate={
//                     selectedIds.length > 0 &&
//                     selectedIds.length < customers.length
//                   }
//                   checked={
//                     customers.length > 0 &&
//                     selectedIds.length === customers.length
//                   }
//                   onChange={handleSelectAll}
//                   sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
//                 />
//               </TableCell>
//               <TableCell align="center">Sr. No</TableCell>
//               <TableCell>Customer Name</TableCell>
//               <TableCell>Mother's Name</TableCell>
//               <TableCell>Email ID</TableCell>
//               <TableCell>Phone Number</TableCell>
//               <TableCell>Aadhar Number</TableCell>
//               <TableCell>PAN Number</TableCell>
//               <TableCell>Birth Place</TableCell>
//               <TableCell>Nominee Name</TableCell>
//               <TableCell>Relationship</TableCell>
//               <TableCell>Nominee ID</TableCell>
//               <TableCell>Nominee Contact</TableCell>
//               <TableCell>Bank Details</TableCell>
//               <TableCell>Admin Notes</TableCell>
//               <TableCell align="center">Actions / Documents</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {customers.map((row, index) => (
//               <TableRow
//                 key={row.id}
//                 sx={{
//                   "&:nth-of-type(even)": { bgcolor: "#f9f9f9" },
//                   "&:hover": { bgcolor: "#f1f4f8" },
//                   bgcolor: selectedIds.includes(row.id) ? "#e3f2fd" : "inherit",
//                 }}
//               >
//                 <TableCell align="center">
//                   <Checkbox
//                     checked={selectedIds.includes(row.id)}
//                     onChange={() => handleSelectOne(row.id)}
//                   />
//                 </TableCell>
//                 <TableCell align="center">
//                   <b>{index + 1}</b>
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>
//                   {row.customer_name}
//                 </TableCell>
//                 <TableCell>{row.mother_name || "-"}</TableCell>
//                 {/* Database mein column 'emall' hai, toh row.emall use hoga agar backend wahi bhej raha hai */}
//                 <TableCell>{row.emall || row.email || "-"}</TableCell>
//                 <TableCell>{row.phone}</TableCell>
//                 <TableCell>{row.aadhar_number || "-"}</TableCell>
//                 <TableCell>{row.pan_number || "-"}</TableCell>
//                 <TableCell>{row.birth_place || "-"}</TableCell>
//                 <TableCell>{row.nominee_name || "-"}</TableCell>
//                 <TableCell>{row.nominee_relation || "-"}</TableCell>
//                 <TableCell>{row.nominee_id || "-"}</TableCell>
//                 <TableCell>{row.nominee_contact || "-"}</TableCell>
//                 <TableCell sx={{ minWidth: 200 }}>
//                   {row.bank_details || "-"}
//                 </TableCell>
//                 <TableCell sx={{ minWidth: 150, fontStyle: "italic" }}>
//                   {row.notes || "-"}
//                 </TableCell>
//                 <TableCell align="center">
//                   <Box
//                     sx={{ display: "flex", gap: 1, justifyContent: "center" }}
//                   >
//                     {row.doc_photo && (
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         onClick={() =>
//                           window.open(`${API_BASE}${row.doc_photo}`)
//                         }
//                       >
//                         Photo
//                       </Button>
//                     )}
//                     {row.doc_id_proof && (
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         color="secondary"
//                         onClick={() =>
//                           window.open(`${API_BASE}${row.doc_id_proof}`)
//                         }
//                       >
//                         Aadhar
//                       </Button>
//                     )}
//                     {row.doc_pan && (
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         color="success"
//                         onClick={() => window.open(`${API_BASE}${row.doc_pan}`)}
//                       >
//                         PAN
//                       </Button>
//                     )}
//                     {row.doc_bank && (
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         color="warning"
//                         onClick={() =>
//                           window.open(`${API_BASE}${row.doc_bank}`)
//                         }
//                       >
//                         Bank
//                       </Button>
//                     )}
//                     <IconButton
//                       color="error"
//                       onClick={() => handleDelete([row.id])}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalNominees: 0,
    isLoading: true
  });

  const API_BASE = "https://lightyellow-mole-663257.hostingersite.com/api/";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Re-using the existing get_customers.php API to count records
      const res = await axios.get(`${API_BASE}get_customers.php`);
      const data = res.data;
      
      // Calculate counts
      const customersCount = data.length;
      // Nominee exists if nominee_name is not empty
      const nomineesCount = data.filter(c => c.nominee_name && c.nominee_name.trim() !== "").length;

      setStats({
        totalCustomers: customersCount,
        totalNominees: nomineesCount,
        isLoading: false
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cardData = [
    {
      id: "customers",
      title: "Customers",
      count: stats.totalCustomers,
      desc: "View and manage all customer details. Add, edit, or delete customer information.",
      icon: <GroupIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bgGradient: "linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)",
      blobColor: "rgba(33, 150, 243, 0.1)",
      path: "/customer-list",
    },
    {
      id: "nominees",
      title: "Nominees",
      count: stats.totalNominees,
      desc: "View all nominee information linked to customers. Track nominee details.",
      icon: <PersonAddIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bgGradient: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
      blobColor: "rgba(0, 176, 155, 0.1)",
      path: "/nominee-list",
    },
    {
      id: "uploads",
      title: "Uploads",
      count: "Manage", // Text instead of count for this one
      desc: "Manage customer documents and files. View Aadhar, PAN, and bank documents.",
      icon: <FileUploadIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bgGradient: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
      blobColor: "rgba(142, 45, 226, 0.1)",
      path: "/document-manager",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        flexWrap: { xs: "wrap", md: "nowrap" },
        mb: 5,
      }}
    >
      {cardData.map((card, index) => (
        <Card
          key={index}
          onClick={() => navigate(card.path)}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", md: "300px" },
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 20px 30px -10px rgba(0,0,0,0.1)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: card.blobColor,
            },
          }}
        >
          <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
            
            {/* Header Area with Icon and Count */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: card.bgGradient,
                }}
              >
                {card.icon}
              </Box>

              {/* Dynamic Number Display */}
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Total
                </Typography>
                {stats.isLoading ? (
                   <CircularProgress size={24} sx={{ mt: 1, color: card.id === 'customers' ? '#2196f3' : card.id === 'nominees' ? '#00b09b' : '#8e2de2' }} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    {card.count}
                  </Typography>
                )}
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1.5, color: "#1e293b" }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 4,
                lineHeight: 1.6,
                minHeight: "48px",
              }}
            >
              {card.desc}
            </Typography>
            
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #f1f5f9",
                pt: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#94a3b8" }}
              >
                Click to manage
              </Typography>
              <ArrowForwardIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default AdminDashboard;