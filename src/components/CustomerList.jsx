import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Stack,
  Modal,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  Grid,
  TablePagination
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit"; // Edit Icon added
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

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default to 10 rows
  // View Modal State
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Edit Modal State
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [openNotes, setOpenNotes] = useState(false);
  const [notesData, setNotesData] = useState({ id: "", notes: "" });

  const API_BASE = "https://lightyellow-mole-663257.hostingersite.com/api/";

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
      item.aadhar_number?.includes(searchTerm)
    );
  });
  // Reset page to 0 when search term changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);
  const handleOpenNotesModal = (customer) => {
    setNotesData({
      id: customer.id,
      notes: customer.notes || "",
    });
    setOpenNotes(true);
  };

  // NEW: Handle change for Notes Only Modal
  const handleNotesChange = (e) => {
    setNotesData({ ...notesData, notes: e.target.value });
  };

  // NEW: Submit ONLY notes
  const handleNotesSubmit = async () => {
    // We only send ID and Notes to update just this field
    const payload = new FormData();
    payload.append("id", notesData.id);
    payload.append("notes", notesData.notes || "");

    // Note: This assumes your update_customer.php backend can handle partial updates.
    // If your backend requires ALL fields, we need to send the full customer object instead.
    // Let's assume for safety we are doing a dedicated call or your backend handles it gracefully.

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
      console.error(err);
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
        const res = await axios.post(`${API_BASE}delete_customers.php`, {
          ids: idsToDelete,
        });
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

  // Open View Modal
  const handleOpenModal = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (customer) => {
    setEditData({ ...customer });
    setOpenEdit(true);
  };

  // Handle Input Change for Edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Edit Data
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
      console.error(err);
      Swal.fire("Error", "Server error while updating.", "error");
    }
  };
  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the sliced data for the current page
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
          placeholder="Search by Name, Phone, or Aadhaar..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            bgcolor: "white",
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              "& fieldset": { borderColor: "#cbd5e1" },
              "&:hover fieldset": { borderColor: "#004c8f" },
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
      {/* Table & Pagination wrapped in a single Paper for clean UI */}
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
                <TableCell
                  align="left"
                  sx={{ color: "white", fontWeight: "bold", pr: 4 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((row, index) => {
                const actualIndex = page * rowsPerPage + index + 1; // Calculate correct serial number
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
                        {/* CHANGED: Now opens the dedicated Notes modal */}
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
                  <TableCell colSpan={6} align="center" sx={{ py: 5, color: "#94a3b8" }}>
                    No records found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Component */}
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

      {/* ORIGINAL VIEW MODAL (Updated with Nominee Docs) */}
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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px", mb: 2 }}>
                <InfoBox label="Full Name" value={selectedCustomer.customer_name} />
                <InfoBox label="Mother's Name" value={selectedCustomer.mother_name} />
                <InfoBox label="Phone Number" value={selectedCustomer.phone} />
                <InfoBox label="Email ID" value={selectedCustomer.emall || selectedCustomer.email} />
                <InfoBox label="Aadhaar Number" value={selectedCustomer.aadhar_number} />
                <InfoBox label="PAN Number" value={selectedCustomer.pan_number} />
                <InfoBox label="Birth Place" value={selectedCustomer.birth_place} />
                <InfoBox label="Nominee Notes" value={selectedCustomer.notes} />
              </Box>

              {/* 2. NOMINEE & BANKING */}
              <Typography variant="subtitle2" sx={{ color: "#ff8c00", fontWeight: 900, mb: 3, mt: 2, pb: 1, borderBottom: "2px solid #e2e8f0", display: "inline-block" }}>
                2. NOMINEE & BANKING
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px", mb: 2 }}>
                <InfoBox label="Nominee Name" value={selectedCustomer.nominee_name} />
                <InfoBox label="Relationship" value={selectedCustomer.nominee_relation} />
                <InfoBox label="Nominee ID" value={selectedCustomer.nominee_id} />
                <InfoBox label="Nominee Contact" value={selectedCustomer.nominee_contact} />
                <InfoBox label="Nominee Email" value={selectedCustomer.nominee_email} />
                <InfoBox label="Bank Account Details" value={selectedCustomer.bank_details} />
                <Box sx={{ width: "100%" }}>
                  <InfoBox label="Nominee Notes" value={selectedCustomer.nominee_notes} />
                </Box>
              </Box>

              {/* 3. KYC DOCUMENTS */}
              <Typography variant="subtitle2" sx={{ color: "#2e7d32", fontWeight: 900, mb: 3, mt: 2, pb: 1, borderBottom: "2px solid #e2e8f0", display: "inline-block" }}>
                3. KYC DOCUMENTS
              </Typography>

              {/* Customer Docs Row */}
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: '#64748b', mb: 1 }}>
                CUSTOMER DOCUMENTS:
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3, gap: 2 }}>
                {selectedCustomer.doc_photo && <Button variant="outlined" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.doc_photo}`)}>View Photo</Button>}
                {selectedCustomer.doc_id_proof && <Button variant="outlined" color="success" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.doc_id_proof}`)}>View Aadhaar</Button>}
                {selectedCustomer.doc_pan && <Button variant="outlined" color="warning" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.doc_pan}`)}>View PAN Card</Button>}
                {selectedCustomer.doc_bank && <Button variant="outlined" color="error" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.doc_bank}`)}>View Bank Proof</Button>}
              </Stack>

              {/* Nominee Docs Row */}
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: '#64748b', mb: 1 }}>
                NOMINEE DOCUMENTS:
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1, gap: 2 }}>
                {selectedCustomer.nominee_doc_photo && <Button variant="outlined" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.nominee_doc_photo}`)}>Nominee Photo</Button>}
                {selectedCustomer.nominee_doc_id_proof && <Button variant="outlined" color="success" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.nominee_doc_id_proof}`)}>Nominee ID</Button>}
                {selectedCustomer.nominee_doc_pan && <Button variant="outlined" color="warning" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.nominee_doc_pan}`)}>Nominee PAN</Button>}
                {selectedCustomer.nominee_doc_bank && <Button variant="outlined" color="error" size="small" onClick={() => window.open(`${API_BASE}uploads/${selectedCustomer.nominee_doc_bank}`)}>Nominee Bank</Button>}

                {/* Fallback agar koi nominee document na ho */}
                {(!selectedCustomer.nominee_doc_photo && !selectedCustomer.nominee_doc_id_proof && !selectedCustomer.nominee_doc_pan && !selectedCustomer.nominee_doc_bank) && (
                  <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic", mt: 1 }}>
                    No nominee documents uploaded yet.
                  </Typography>
                )}
              </Stack>

            </Box>
          )}
        </Box>
      </Modal>
      {/* --- EDIT MODAL --- */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: "85%", md: 900 }, // Responsive Modal Width
            bgcolor: "#fff",
            borderRadius: 4,
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
            maxHeight: "90vh",
            overflowY: "auto",
            outline: "none",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: { xs: 2, sm: 3 }, borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
              Edit Customer Details
            </Typography>
            <IconButton onClick={() => setOpenEdit(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}> {/* Responsive Padding */}
            <Typography variant="body2" sx={{ color: "error.main", fontWeight: "bold", mb: 3, fontStyle: "italic" }}>
              NOTE: Please fill necessary fields marked *
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }}> {/* Responsive Grid Spacing */}
              {/* Standard Fields: 1 col (Mobile), 2 cols (Tablet), 3 cols (Desktop) */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Customer Name *" name="customer_name" value={editData.customer_name || ""} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Mother's Name *" name="mother_name" value={editData.mother_name || ""} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Email ID" name="email" value={editData.email || ""} onChange={handleEditChange} />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Aadhaar Number *" name="aadhar_number" value={editData.aadhar_number || ""} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="PAN Number *" name="pan_number" value={editData.pan_number || ""} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Phone Number *" name="phone" value={editData.phone || ""} onChange={handleEditChange} />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Birth Place" name="birth_place" value={editData.birth_place || ""} onChange={handleEditChange} />
              </Grid>

              {/* DYNAMIC NOTES - Always 100% width */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={4}
                  label="Dynamic Notes"
                  name="notes"
                  value={editData.notes || ""}
                  onChange={handleEditChange}
                  placeholder="Enter customer notes here..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Action Buttons - Stack vertically on small screens */}
            <Box sx={{ mt: 4, display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, gap: 2, justifyContent: "space-between", alignItems: "center" }}>
              <Button sx={{ color: "#94a3b8", width: { xs: "100%", sm: "auto" } }} onClick={() => setOpenEdit(false)}>
                BACK
              </Button>
              <Button variant="contained" sx={{ bgcolor: "#004c8f", boxShadow: "none", fontWeight: "bold", px: 4, py: { xs: 1.5, sm: 1 }, width: { xs: "100%", sm: "auto" } }} onClick={handleUpdateSubmit}>
                SAVE & UPDATE
              </Button>
            </Box>

          </Box>
        </Box>
      </Modal>
      {/* --- QUICK NOTES MODAL --- */}
      <Modal open={openNotes} onClose={() => setOpenNotes(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 500 }, // Smaller width than edit modal
            bgcolor: "#fff",
            borderRadius: 4,
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
            outline: "none",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: { xs: 2, sm: 3 }, borderBottom: "1px solid #f1f5f9", bgcolor: "#fffbeb" /* slight yellow tint for notes */ }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#d97706", display: 'flex', alignItems: 'center', gap: 1 }}>
              <NoteAltIcon /> Customer Notes
            </Typography>
            <IconButton onClick={() => setOpenNotes(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <TextField
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
              label={notesData.notes ? "Edit Notes" : "Add New Note"}
              name="notes"
              value={notesData.notes}
              onChange={handleNotesChange}
              placeholder="Type your important notes, reminders, or updates about this customer here..."
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafafa",
                  fontSize: "0.95rem"
                }
              }}
            />

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button sx={{ color: "#64748b" }} onClick={() => setOpenNotes(false)}>
                CANCEL
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#d97706", '&:hover': { bgcolor: "#b45309" }, boxShadow: "none", fontWeight: "bold", px: 3 }}
                onClick={handleNotesSubmit}
              >
                SAVE NOTE
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomerList;