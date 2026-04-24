import React, { useEffect, useState } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Stack, Modal, Typography, Divider, TextField,
  InputAdornment, Grid, TablePagination
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [openNotes, setOpenNotes] = useState(false);
  const [notesData, setNotesData] = useState({ id: "", notes: "" });

  const API_BASE = "https://shreeinvestment.in/api/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}get_customers.php`);
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCustomers = customers.filter((item) => {
    return (
      item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.includes(searchTerm) ||
      item.aadhar_number?.includes(searchTerm) ||
      item.pan_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const handleOpenNotesModal = (customer) => {
    setNotesData({ id: customer.id, notes: customer.notes || "" });
    setOpenNotes(true);
  };

  const handleNotesChange = (e) => {
    setNotesData({ ...notesData, notes: e.target.value });
  };

  const handleNotesSubmit = async () => {
    const payload = new FormData();
    payload.append("id", notesData.id);
    payload.append("notes", notesData.notes || "");

    try {
      const res = await axios.post(`${API_BASE}update_customer.php`, payload);
      if (res.data.status === "success") {
        Swal.fire("Updated!", "Customer notes saved successfully.", "success");
        setOpenNotes(false);
        fetchData();
      } else {
        Swal.fire("Error", res.data.message || "Failed to save notes", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error while saving notes.", "error");
    }
  };

  const handleDelete = async (idsToDelete) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete ${idsToDelete.length} record(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${API_BASE}delete_customers.php`, { ids: idsToDelete });
        if (res.data.status === "success") {
          Swal.fire("Deleted!", "Success", "success");
          setSelectedIds([]);
          fetchData();
        }
      } catch (err) {
        Swal.fire("Error", "Action failed", "error");
      }
    }
  };

  // NAYA: Handle Open Modal - Ab ye backend se full data with nominees fetch karega
  const handleOpenModal = async (customer) => {
    try {
      const res = await axios.get(`${API_BASE}get_customer.php?phone=${customer.phone}`);
      if (res.data.status === "success") {
        setSelectedCustomer(res.data.data); // data contains customer + nominees array
        setOpen(true);
      } else {
        // Fallback if full data not found
        setSelectedCustomer(customer);
        setOpen(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback in case of error
      setSelectedCustomer(customer);
      setOpen(true);
    }
  };

  const handleOpenEditModal = (customer) => {
    setEditData({ ...customer });
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    const payload = new FormData();
    payload.append("id", editData.id);
    payload.append("customer_name", editData.customer_name || "");
    payload.append("mother_name", editData.mother_name || "");
    payload.append("email", editData.email || "");
    payload.append("phone", editData.phone || "");
    payload.append("aadhar_number", editData.aadhar_number || "");
    payload.append("pan_number", editData.pan_number || "");
    payload.append("birth_place", editData.birth_place || "");
    payload.append("notes", editData.notes || "");

    try {
      const res = await axios.post(`${API_BASE}update_customer.php`, payload);
      if (res.data.status === "success") {
        Swal.fire("Updated!", "Customer details updated successfully.", "success");
        setOpenEdit(false);
        fetchData();
      } else {
        Swal.fire("Error", res.data.message || "Failed to update", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error while updating.", "error");
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const InfoBox = ({ label, value }) => (
    <Box sx={{ width: { xs: "100%", sm: "calc(50% - 20px)", md: "calc(33.33% - 20px)" }, mb: 3 }}>
      <Typography variant="caption" sx={{ fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", mt: 0.5 }}>
        {value || "---"}
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard")} sx={{ color: "#64748b", fontWeight: "bold" }}>
          Back to Dashboard
        </Button>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/new-application")} sx={{ bgcolor: "#004c8f" }}>
            Add New Customer
          </Button>
          {selectedIds.length > 0 && (
            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(selectedIds)}>
              Delete ({selectedIds.length})
            </Button>
          )}
        </Stack>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by Name, Phone, Aadhaar, or PAN..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            bgcolor: "white",
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              "& fieldset": { borderColor: "#cbd5e1" },
              "&:hover fieldset": { borderColor: "#004c8f" }, // YAHAN CHANGE KIYA HAI
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
            sx: { height: "50px" },
          }}
        />
      </Box>

      <Paper sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#004c8f" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{ color: "white" }}
                    onChange={(e) => setSelectedIds(e.target.checked ? paginatedCustomers.map((c) => c.id) : [])}
                    checked={paginatedCustomers.length > 0 && paginatedCustomers.every((c) => selectedIds.includes(c.id))}
                  />
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sr.</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Customer Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone No.</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>PAN No.</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Aadhaar No.</TableCell>
                <TableCell align="left" sx={{ color: "white", fontWeight: "bold", pr: 4 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((row, index) => {
                const actualIndex = page * rowsPerPage + index + 1;
                return (
                  <TableRow key={row.id} hover selected={selectedIds.includes(row.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onChange={() => setSelectedIds((prev) => prev.includes(row.id) ? prev.filter((i) => i !== row.id) : [...prev, row.id])}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#64748b" }}>{actualIndex}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{row.customer_name}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.pan_number || "---"}</TableCell>
                    <TableCell>{row.aadhar_number || "---"}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton size="small" color="primary" onClick={() => handleOpenModal(row)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="secondary" onClick={() => handleOpenEditModal(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#d97706" }} onClick={() => handleOpenNotesModal(row)}>
                          <NoteAltIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete([row.id])}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: "#94a3b8" }}>
                    No records found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid #e2e8f0" }}
        />
      </Paper>

      {/* --- NAYA VIEW MODAL (MULTIPLE NOMINEES KE SAATH) --- */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "95%", md: 850 }, bgcolor: "#fff", borderRadius: 4, boxShadow: "0 25px 50px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto", outline: "none" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f" }}>Full Customer Profile</Typography>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Box>
          {selectedCustomer && (
            <Box sx={{ p: 4 }}>
              {/* 1. PERSONAL DETAILS */}
              <Typography variant="subtitle2" sx={{ color: "#004c8f", fontWeight: 900, mb: 3, pb: 1, borderBottom: "2px solid #e2e8f0", display: "inline-block" }}>
                1. PERSONAL DETAILS
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px", mb: 4 }}>
                <InfoBox label="Full Name" value={selectedCustomer.customer_name} />
                <InfoBox label="Mother's Name" value={selectedCustomer.mother_name} />
                <InfoBox label="Phone Number" value={selectedCustomer.phone} />
                <InfoBox label="Email ID" value={selectedCustomer.email} />
                <InfoBox label="Aadhaar Number" value={selectedCustomer.aadhar_number} />
                <InfoBox label="PAN Number" value={selectedCustomer.pan_number} />
                <InfoBox label="Birth Place" value={selectedCustomer.birth_place} />
                <Box sx={{ width: "100%" }}><InfoBox label="Customer Notes" value={selectedCustomer.notes} /></Box>
              </Box>

              {/* 2. CUSTOMER KYC DOCUMENTS */}
              <Typography variant="subtitle2" sx={{ color: "#2e7d32", fontWeight: 900, mb: 3, pb: 1, borderBottom: "2px solid #e2e8f0", display: "inline-block" }}>
                2. CUSTOMER KYC DOCUMENTS
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 4, gap: 2 }}>
                {selectedCustomer.doc_photo && <Button variant="outlined" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.doc_photo}`)}>View Photo</Button>}
                {selectedCustomer.doc_id_proof && <Button variant="outlined" color="success" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.doc_id_proof}`)}>View Aadhaar</Button>}
                {selectedCustomer.doc_pan && <Button variant="outlined" color="warning" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.doc_pan}`)}>View PAN Card</Button>}
                {selectedCustomer.doc_bank && <Button variant="outlined" color="error" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.doc_bank}`)}>View Bank Proof</Button>}

                {(!selectedCustomer.doc_photo && !selectedCustomer.doc_id_proof && !selectedCustomer.doc_pan && !selectedCustomer.doc_bank) && (
                  <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic" }}>No customer documents uploaded.</Typography>
                )}
              </Stack>

              {/* 3. NOMINEE LIST (MAPPED) */}
              <Typography variant="subtitle2" sx={{ color: "#ff8c00", fontWeight: 900, mb: 3, pb: 1, borderBottom: "2px solid #e2e8f0", display: "inline-block" }}>
                3. NOMINEE DETAILS
              </Typography>

              {selectedCustomer.nominees && selectedCustomer.nominees.length > 0 ? (
                selectedCustomer.nominees.map((nominee, idx) => (
                  <Paper key={idx} elevation={0} sx={{ p: 3, mb: 3, border: "1px solid #e2e8f0", borderRadius: 2, bgcolor: "#fafcff" }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#004c8f" mb={2}>
                      Nominee {idx + 1}: {nominee.nominee_name}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px", mb: 2 }}>
                      <InfoBox label="Relationship" value={nominee.nominee_relation} />
                      <InfoBox label="Nominee ID" value={nominee.nominee_id} />
                      <InfoBox label="Contact" value={nominee.nominee_contact} />
                      <InfoBox label="Email" value={nominee.nominee_email} />
                      <InfoBox label="Bank Details" value={nominee.bank_details} />
                      <Box sx={{ width: "100%" }}><InfoBox label="Notes" value={nominee.nominee_notes} /></Box>
                    </Box>

                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: '#64748b', mb: 1, mt: 2 }}>
                      NOMINEE {idx + 1} DOCUMENTS:
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 2 }}>
                      {nominee.nominee_doc_photo && <Button variant="outlined" size="small" onClick={() => window.open(`${API_BASE}uploads/${nominee.nominee_doc_photo}`)}>Photo</Button>}
                      {nominee.nominee_doc_id_proof && <Button variant="outlined" color="success" size="small" onClick={() => window.open(`${API_BASE}uploads/${nominee.nominee_doc_id_proof}`)}>ID Proof</Button>}
                      {nominee.nominee_doc_pan && <Button variant="outlined" color="warning" size="small" onClick={() => window.open(`${API_BASE}uploads/${nominee.nominee_doc_pan}`)}>PAN</Button>}
                      {nominee.nominee_doc_bank && <Button variant="outlined" color="error" size="small" onClick={() => window.open(`${API_BASE}uploads/${nominee.nominee_doc_bank}`)}>Bank</Button>}

                      {(!nominee.nominee_doc_photo && !nominee.nominee_doc_id_proof && !nominee.nominee_doc_pan && !nominee.nominee_doc_bank) && (
                        <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic", mt: 1 }}>No documents uploaded for this nominee.</Typography>
                      )}
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>No nominees found for this customer.</Typography>
              )}
            </Box>
          )}
        </Box>
      </Modal>

      {/* Edit & Notes Modals (Unchanged) */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        {/* ... Same Edit Modal Code as you had ... */}
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "95%", sm: "85%", md: 900 }, bgcolor: "#fff", boxShadow: "0 25px 50px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto", outline: "none" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: { xs: 2, sm: 3 }, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>Edit Customer Details</Typography>
            <IconButton onClick={() => setOpenEdit(false)}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Customer Name *" name="customer_name" value={editData.customer_name || ""} onChange={handleEditChange} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Mother's Name *" name="mother_name" value={editData.mother_name || ""} onChange={handleEditChange} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Email ID" name="email" value={editData.email || ""} onChange={handleEditChange} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Aadhaar Number *" name="aadhar_number" value={editData.aadhar_number || ""} onChange={handleEditChange} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="PAN Number *" name="pan_number" value={editData.pan_number || ""} onChange={handleEditChange} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Phone Number *" name="phone" value={editData.phone || ""} onChange={handleEditChange} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Birth Place" name="birth_place" value={editData.birth_place || ""} onChange={handleEditChange} /></Grid>
            </Grid>
            <Box sx={{ width: "100%", mt: { xs: 2, sm: 3 } }}>
              <TextField fullWidth multiline minRows={3} maxRows={5} label="Dynamic Notes" name="notes" value={editData.notes || ""} onChange={handleEditChange} />
            </Box>
            <Box sx={{ mt: 4, display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, gap: 2, justifyContent: "space-between", alignItems: "center" }}>
              <Button sx={{ color: "#94a3b8", width: { xs: "100%", sm: "auto" } }} onClick={() => setOpenEdit(false)}>BACK</Button>
              <Button variant="contained" sx={{ bgcolor: "#004c8f", fontWeight: "bold", px: 4, py: { xs: 1.5, sm: 1 }, width: { xs: "100%", sm: "auto" } }} onClick={handleUpdateSubmit}>SAVE & UPDATE</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal open={openNotes} onClose={() => setOpenNotes(false)}>
        {/* ... Same Notes Modal Code as you had ... */}
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "95%", sm: "85%", md: 900 }, minHeight: { md: "60vh" }, bgcolor: "#fff", boxShadow: "0 25px 50px rgba(0,0,0,0.2)", outline: "none", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: { xs: 2, sm: 3 }, borderBottom: "1px solid #f1f5f9", bgcolor: "#fffbeb" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#d97706", display: 'flex', alignItems: 'center', gap: 1 }}><NoteAltIcon /> Customer Notes</Typography>
            <IconButton onClick={() => setOpenNotes(false)}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <TextField fullWidth multiline minRows={12} maxRows={28} label={notesData.notes ? "Edit Notes" : "Add New Note"} name="notes" value={notesData.notes} onChange={handleNotesChange} autoFocus sx={{ flexGrow: 1, "& .MuiOutlinedInput-root": { backgroundColor: "#fafafa", fontSize: "1rem", alignItems: "flex-start" } }} />
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button sx={{ color: "#64748b" }} onClick={() => setOpenNotes(false)}>CANCEL</Button>
              <Button variant="contained" sx={{ bgcolor: "#d97706", '&:hover': { bgcolor: "#b45309" }, boxShadow: "none", fontWeight: "bold", px: 4, py: 1 }} onClick={handleNotesSubmit}>SAVE NOTE</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomerList;