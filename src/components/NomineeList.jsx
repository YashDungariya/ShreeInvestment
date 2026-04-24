import React, { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, Typography, IconButton, Modal, Divider, Stack,
  Grid, TablePagination, Avatar, MenuItem
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const NomineeList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]); // Customer list for dropdown
  const [nomineesList, setNomineesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals state
  const [viewOpen, setViewOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [addOpen, setAddOpen] = useState(false); // NEW: Add Modal State

  const [selectedNominee, setSelectedNominee] = useState(null);
  const [editData, setEditData] = useState({});

  // Add Nominee State (Array to support multiple)
  const [addCustomerPhone, setAddCustomerPhone] = useState("");
  const [newNominees, setNewNominees] = useState([{
    nomineeName: "", nomineeRelation: "", nomineeId: "", nomineeContact: "", nomineeEmail: ""
  }]);

  const API_BASE = "https://shreeinvestment.in/api/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}get_customers.php`);
      const allCustomers = res.data;
      setCustomers(allCustomers); // Save for dropdown

      let flatNominees = [];
      if (allCustomers && Array.isArray(allCustomers)) {
        allCustomers.forEach(customer => {
          if (customer.nominees && customer.nominees.length > 0) {
            customer.nominees.forEach(nom => {
              flatNominees.push({
                ...nom,
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

  // --- ACTIONS ---
  const handleViewOpen = (nominee) => { setSelectedNominee(nominee); setViewOpen(true); };

  const handleEditOpen = (nominee) => {
    setEditData({
      id: nominee.id, nominee_name: nominee.nominee_name || "", nominee_relation: nominee.nominee_relation || "",
      nominee_id: nominee.nominee_id || "", nominee_contact: nominee.nominee_contact || "", bank_details: nominee.bank_details || "",
      nominee_email: nominee.nominee_email || "",
    });
    setOpenEdit(true);
  };


  const handleUpdate = async () => {
    try {
      const res = await axios.post(`${API_BASE}update_nominee.php`, editData);
      if (res.data.status === "success") {
        Swal.fire("Success!", "Nominee details updated.", "success");
        setOpenEdit(false); fetchData();
      } else Swal.fire("Error", res.data.message || "Failed to save", "error");
    } catch (err) { Swal.fire("Error", "Server connection error", "error"); }
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Remove Nominee?", text: "This will permanently delete this nominee.", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Yes, Delete" });
    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${API_BASE}delete_nominee.php`, { id });
        if (res.data.status === "success") {
          Swal.fire("Deleted!", "Nominee data removed.", "success"); fetchData();
        }
      } catch (err) { console.error(err); }
    }
  };

  // --- ADD NEW NOMINEE LOGIC ---
  const handleAddOpen = () => {
    setAddCustomerPhone("");
    setNewNominees([{ nomineeName: "", nomineeRelation: "", nomineeId: "", nomineeContact: "", nomineeEmail: "" }]);
    setAddOpen(true);
  };

  const handleNewNomineeChange = (index, field, value) => {
    const updated = [...newNominees];
    updated[index][field] = value;
    setNewNominees(updated);
  };

  const addAnotherNominee = () => {
    setNewNominees([...newNominees, { nomineeName: "", nomineeRelation: "", nomineeId: "", nomineeContact: "", nomineeEmail: "" }]);
  };

  const removeNewNominee = (index) => {
    const updated = newNominees.filter((_, i) => i !== index);
    setNewNominees(updated);
  };

  const handleSaveNewNominees = async () => {
    if (!addCustomerPhone) return Swal.fire("Wait", "Please select a customer first.", "warning");

    const validNominees = newNominees.filter(n => n.nomineeName.trim() !== "");
    if (validNominees.length === 0) return Swal.fire("Wait", "Please enter at least one nominee name.", "warning");

    try {
      const formData = new FormData();
      formData.append("phone", addCustomerPhone); // Customer Link
      formData.append("nominees", JSON.stringify(validNominees));

      // YAHAN BADLAAV HAI: ab ye 'submit_form.php' nahi, balki 'add_nominee.php' ko call karega
      const res = await axios.post(`${API_BASE}add_nominee.php`, formData);

      if (res.data.status === "success") {
        Swal.fire("Success!", "Nominees added successfully.", "success");
        setAddOpen(false);
        fetchData();
      } else {
        Swal.fire("Error", res.data.message || "Failed to add nominees", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server connection error", "error");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f1f5f9", minHeight: "100vh" }}>

      {/* Header Area with Add Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard")} sx={{ color: "#475569", fontWeight: "bold" }}>Back to Dashboard</Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOpen} sx={{ bgcolor: "#004c8f" }}>
          Add Nominee
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth placeholder="Search by Nominee Name, Customer Name or Phone..." variant="outlined"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
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

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "#ff8c00", fontSize: "14px", width: 32, height: 32 }}>{row.nominee_name?.charAt(0) || "N"}</Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#004c8f" }}>{row.nominee_name}</Typography>
                      </Box>
                    </TableCell>

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

      {/* --- ADD NEW NOMINEE MODAL (MULTIPLE) --- */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "95%", sm: 700, md: 900 }, maxHeight: "90vh", overflowY: "auto", bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4, outline: "none" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f" }}>Add New Nominee(s)</Typography>
            <IconButton onClick={() => setAddOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4, p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
            <TextField
              select label="Select Parent Customer *" fullWidth value={addCustomerPhone} onChange={(e) => setAddCustomerPhone(e.target.value)}
              helperText="The new nominees will be linked to this customer."
            >
              {customers.map((cust) => (
                <MenuItem key={cust.id} value={cust.phone}>{cust.customer_name} (Ph: {cust.phone})</MenuItem>
              ))}
            </TextField>
          </Box>

          {newNominees.map((nom, index) => (
            <Box key={index} sx={{ mb: 3, p: 3, border: "1px solid #e2e8f0", borderRadius: 2, position: "relative" }}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: "#ff8c00", fontWeight: "bold" }}>Nominee {index + 1}</Typography>
              {newNominees.length > 1 && (
                <IconButton onClick={() => removeNewNominee(index)} color="error" size="small" sx={{ position: "absolute", top: 10, right: 10 }}><DeleteIcon /></IconButton>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField label="Nominee Name *" fullWidth size="small" value={nom.nomineeName} onChange={(e) => handleNewNomineeChange(index, "nomineeName", e.target.value)} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Relationship *" fullWidth size="small" value={nom.nomineeRelation} onChange={(e) => handleNewNomineeChange(index, "nomineeRelation", e.target.value)} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="ID / Aadhaar" fullWidth size="small" value={nom.nomineeId} onChange={(e) => handleNewNomineeChange(index, "nomineeId", e.target.value)} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Contact Number" fullWidth size="small" value={nom.nomineeContact} onChange={(e) => handleNewNomineeChange(index, "nomineeContact", e.target.value)} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Email ID" fullWidth size="small" value={nom.nomineeEmail} onChange={(e) => handleNewNomineeChange(index, "nomineeEmail", e.target.value)} /></Grid>
              </Grid>
            </Box>
          ))}

          <Button startIcon={<AddIcon />} onClick={addAnotherNominee} sx={{ color: "#004c8f", fontWeight: "bold", mb: 3 }}>
            Add Another Nominee
          </Button>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", pt: 3 }}>
            <Button sx={{ color: "#64748b" }} onClick={() => setAddOpen(false)}>CANCEL</Button>
            <Button variant="contained" onClick={handleSaveNewNominees} sx={{ bgcolor: "#004c8f", px: 4, fontWeight: "bold" }}>SAVE ALL NOMINEES</Button>
          </Box>
        </Box>
      </Modal>

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
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button sx={{ color: "#004c8f" }} onClick={() => setOpenEdit(false)}>CANCEL</Button>
            <Button variant="contained" onClick={handleUpdate} sx={{ bgcolor: "#004c8f", px: 4, fontWeight: "bold" }}>SAVE</Button>
          </Box>
        </Box>
      </Modal>

      {/* --- VIEW SINGLE NOMINEE MODAL --- */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: 800 },
          minHeight: { sm: 400 },
          bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4, outline: "none"
        }}>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f", fontSize: "1.25rem" }}>Nominee Details</Typography>
            <IconButton onClick={() => setViewOpen(false)} sx={{ bgcolor: "#f1f5f9" }}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 4 }} />

          {selectedNominee && (
            <Grid container spacing={4}>

              {/* --- LINE 1 (3 Items) --- */}
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", textTransform: "uppercase" }}>Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{selectedNominee.nominee_name || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", textTransform: "uppercase" }}>For Customer</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, color: "#004c8f" }}>{selectedNominee.parent_customer_name || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", textTransform: "uppercase" }}>Relationship</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>{selectedNominee.nominee_relation || "N/A"}</Typography>
              </Grid>

              {/* --- LINE 2 (3 Items) --- */}
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", textTransform: "uppercase" }}>ID / Aadhaar</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>{selectedNominee.nominee_id || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", textTransform: "uppercase" }}>Contact Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>{selectedNominee.nominee_contact || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", textTransform: "uppercase" }}>Email ID</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>{selectedNominee.nominee_email || "N/A"}</Typography>
              </Grid>

            </Grid>
          )}
        </Box>
      </Modal>

    </Box>
  );
};

export default NomineeList;