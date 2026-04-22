import React, { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Typography, IconButton, Modal, Divider, Stack,
  Grid, TablePagination, Avatar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const NomineeList = () => {
  const navigate = useNavigate();
  // Hum ab seedhe nominees ki flat list store karenge
  const [nomineesList, setNomineesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals state
  const [viewOpen, setViewOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [editData, setEditData] = useState({});
  const [notesData, setNotesData] = useState({ id: "", nominee_notes: "" });

  const API_BASE = "https://shreeinvestment.in/api/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}get_customers.php`);
      
      // Flat list logic: Customers ke andar se saare nominees nikal kar ek simple array banayenge
      let flatNominees = [];
      if (res.data && Array.isArray(res.data)) {
        res.data.forEach(customer => {
          if (customer.nominees && customer.nominees.length > 0) {
            customer.nominees.forEach(nom => {
              flatNominees.push({
                ...nom,
                // UI mein dikhane ke liye parent customer ka naam aur phone add kar rahe hain
                parent_customer_name: customer.customer_name,
                parent_customer_phone: customer.phone
              });
            });
          }
        });
      }
      setNomineesList(flatNominees);
    } catch (err) {
      console.error(err);
    }
  };

  // Searching logic for the flat list
  const filteredNominees = nomineesList.filter(
    (item) =>
      item.nominee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.parent_customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.parent_customer_phone?.includes(searchTerm)
  );

  useEffect(() => { setPage(0); }, [searchTerm]);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

  const paginatedNominees = filteredNominees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Actions
  const handleViewOpen = (nominee) => {
    setSelectedNominee(nominee);
    setViewOpen(true);
  };

  const handleEditOpen = (nominee) => {
    setEditData({
      id: nominee.id,
      nominee_name: nominee.nominee_name || "",
      nominee_relation: nominee.nominee_relation || "",
      nominee_id: nominee.nominee_id || "",
      nominee_contact: nominee.nominee_contact || "",
      bank_details: nominee.bank_details || "",
      nominee_email: nominee.nominee_email || "",
      nominee_notes: nominee.nominee_notes || "",
    });
    setOpenEdit(true);
  };

  const handleOpenNotesModal = (nominee) => {
    setNotesData({
      id: nominee.id,
      nominee_notes: nominee.nominee_notes || "",
    });
    setOpenNotes(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.post(`${API_BASE}update_nominee.php`, editData);
      if (res.data.status === "success") {
        Swal.fire("Success!", "Nominee details updated.", "success");
        setOpenEdit(false);
        fetchData();
      } else {
        Swal.fire("Error", res.data.message || "Failed to save", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server connection error", "error");
    }
  };

  const handleNotesSubmit = async () => {
    try {
      const payload = { id: notesData.id, nominee_notes: notesData.nominee_notes };
      const res = await axios.post(`${API_BASE}update_nominee.php`, payload);
      if (res.data.status === "success") {
        Swal.fire("Success!", "Nominee notes saved.", "success");
        setOpenNotes(false);
        fetchData();
      } else {
        Swal.fire("Error", res.data.message || "Failed to save notes", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error while saving notes", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Remove Nominee?", text: "This will permanently delete this nominee.", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Yes, Delete"
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${API_BASE}delete_nominee.php`, { id });
        if (res.data.status === "success") {
          Swal.fire("Deleted!", "Nominee data removed.", "success");
          fetchData();
        }
      } catch (err) { console.error(err); }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f1f5f9", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard")} sx={{ color: "#475569", fontWeight: "bold" }}>Back to Dashboard</Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField 
          fullWidth 
          placeholder="Search by Nominee Name, Customer Name or Phone..." 
          variant="outlined" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          sx={{ bgcolor: "white", "& .MuiOutlinedInput-root": { borderRadius: "8px", "& fieldset": { borderColor: "#e2e8f0" }, "&:hover fieldset": { borderColor: "#004c8f" } } }} 
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "#94a3b8" }} /></InputAdornment>), sx: { height: "50px" } }} 
        />
      </Box>

      <Paper sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead sx={{ bgcolor: "#004c8f" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold", width: "5%" }}>SR.</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>NOMINEE DETAILS</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>CUSTOMER (PARENT)</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>RELATIONSHIP</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>CONTACT</TableCell>
                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedNominees.map((row, index) => {
                const actualIndex = page * rowsPerPage + index + 1;
                return (
                  <TableRow key={row.id} hover sx={{ bgcolor: index % 2 === 0 ? "#ffffff" : "#fdfdfd" }}>
                    <TableCell sx={{ color: "#64748b" }}>{actualIndex}</TableCell>
                    
                    {/* Nominee Details Column */}
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "#ff8c00", fontSize: "14px", width: 32, height: 32 }}>
                          {row.nominee_name?.charAt(0) || "N"}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#004c8f" }}>
                          {row.nominee_name}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Customer Parent Column */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>{row.parent_customer_name}</Typography>
                      <Typography variant="caption" sx={{ color: "gray" }}>Ph: {row.parent_customer_phone}</Typography>
                    </TableCell>

                    <TableCell>{row.nominee_relation || "---"}</TableCell>
                    <TableCell>{row.nominee_contact || "---"}</TableCell>
                    
                    <TableCell align="left">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton size="small" color="info" onClick={() => handleViewOpen(row)}><VisibilityIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="primary" onClick={() => handleEditOpen(row)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: "#d97706" }} onClick={() => handleOpenNotesModal(row)}><NoteAltIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
              {paginatedNominees.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "#94a3b8" }}>No nominees found matching your search</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={filteredNominees.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} sx={{ borderTop: "1px solid #e2e8f0" }} />
      </Paper>

      {/* --- EDIT NOMINEE MODAL --- */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "95%", sm: 600, md: 800 }, bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4, outline: "none" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f" }}>Edit Nominee Details</Typography>
            <IconButton onClick={() => setOpenEdit(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}><TextField label="Nominee Name *" fullWidth value={editData.nominee_name} onChange={(e) => setEditData({ ...editData, nominee_name: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Nominee Relationship *" fullWidth value={editData.nominee_relation} onChange={(e) => setEditData({ ...editData, nominee_relation: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Nominee PAN / Aadhaar" fullWidth value={editData.nominee_id} onChange={(e) => setEditData({ ...editData, nominee_id: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Nominee Contact Number" fullWidth value={editData.nominee_contact} onChange={(e) => setEditData({ ...editData, nominee_contact: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Nominee Email ID" fullWidth value={editData.nominee_email} onChange={(e) => setEditData({ ...editData, nominee_email: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Bank Details" fullWidth value={editData.bank_details} onChange={(e) => setEditData({ ...editData, bank_details: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField label="Notes" fullWidth multiline minRows={3} value={editData.nominee_notes} onChange={(e) => setEditData({ ...editData, nominee_notes: e.target.value })} /></Grid>
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button sx={{ color: "#004c8f" }} onClick={() => setOpenEdit(false)}>CANCEL</Button>
            <Button variant="contained" onClick={handleUpdate} sx={{ bgcolor: "#004c8f", px: 4, fontWeight: "bold" }}>SAVE</Button>
          </Box>
        </Box>
      </Modal>

      {/* --- QUICK NOTES MODAL --- */}
      <Modal open={openNotes} onClose={() => setOpenNotes(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "95%", sm: "85%", md: 600 }, bgcolor: "#fff", boxShadow: 24, outline: "none", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, borderBottom: "1px solid #f1f5f9", bgcolor: "#fffbeb" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#d97706", display: 'flex', alignItems: 'center', gap: 1 }}><NoteAltIcon /> Nominee Notes</Typography>
            <IconButton onClick={() => setOpenNotes(false)}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <TextField fullWidth multiline minRows={5} maxRows={10} autoFocus label="Edit Notes" value={notesData.nominee_notes} onChange={(e) => setNotesData({ ...notesData, nominee_notes: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fafafa" } }} />
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button sx={{ color: "#64748b" }} onClick={() => setOpenNotes(false)}>CANCEL</Button>
              <Button variant="contained" sx={{ bgcolor: "#d97706" }} onClick={handleNotesSubmit}>SAVE NOTE</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* --- VIEW SINGLE NOMINEE MODAL --- */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "95%", sm: 500 }, bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4, outline: "none" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f" }}>Nominee Details</Typography>
            <IconButton onClick={() => setViewOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          {selectedNominee && (
            <Stack spacing={2}>
              <Box><Typography variant="caption" color="text.secondary">Name</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_name || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">For Customer</Typography><Typography variant="body1" fontWeight={600} color="#004c8f">{selectedNominee.parent_customer_name || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Relationship</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_relation || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">ID / Aadhaar</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_id || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Contact</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_contact || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Email</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_email || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Bank Details</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.bank_details || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Notes</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_notes || "N/A"}</Typography></Box>
            </Stack>
          )}
        </Box>
      </Modal>

    </Box>
  );
};

export default NomineeList;