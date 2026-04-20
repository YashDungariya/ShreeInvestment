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
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Modal,
  Divider,
  Stack,
  Grid,
  TablePagination,
  MenuItem // Imported for Dropdown
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add"; // Imported Add Icon
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const NomineeList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal States
  const [open, setOpen] = useState(false); // Edit Modal
  const [viewOpen, setViewOpen] = useState(false); // View Modal
  const [addOpen, setAddOpen] = useState(false); // NEW: Add Modal
  const [selectedNominee, setSelectedNominee] = useState(null);

  const [editData, setEditData] = useState({
    id: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_id: "",
    nominee_contact: "",
    bank_details: "",
    nominee_email: "",
    nominee_notes: "",
  });

  // State for Add Nominee Form
  const [addData, setAddData] = useState({
    id: "", // Customer ID
    nominee_name: "",
    nominee_relation: "",
    nominee_id: "",
    nominee_contact: "",
    bank_details: "",
    nominee_email: "",
    nominee_notes: "",
  });
  // Add this near your other states
  const [openNotes, setOpenNotes] = useState(false);
  const [notesData, setNotesData] = useState({ id: "", nominee_notes: "" });
  // Function to open ONLY the Notes Modal
  const handleOpenNotesModal = (row) => {
    setNotesData({
      id: row.id,
      nominee_notes: row.nominee_notes || "",
    });
    setOpenNotes(true);
  };

  // Function to SUBMIT ONLY Notes
  const handleNotesSubmit = async () => {
    try {
      // Hum yahan sirf id aur notes bhej rahe hain
      const payload = {
        id: notesData.id,
        nominee_notes: notesData.nominee_notes
      };

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

  // Filter out customers who already have a nominee for the "Add Nominee" dropdown
  const customersWithoutNominee = customers.filter(
    (c) => !c.nominee_name || c.nominee_name.trim() === ""
  );

  const handleAddOpen = () => {
    setAddData({
      id: "", nominee_name: "", nominee_relation: "", nominee_id: "", nominee_contact: "", bank_details: "", nominee_email: "", nominee_notes: "",
    });
    setAddOpen(true);
  };

  const handleEditOpen = (row) => {
    setEditData({
      id: row.id,
      nominee_name: row.nominee_name || "",
      nominee_relation: row.nominee_relation || "",
      nominee_id: row.nominee_id || "",
      nominee_contact: row.nominee_contact || "",
      bank_details: row.bank_details || "",
      nominee_email: row.nominee_email || "",
      nominee_notes: row.nominee_notes || "",
    });
    setOpen(true);
  };

  const handleViewOpen = (row) => {
    setSelectedNominee(row);
    setViewOpen(true);
  };

  const handleUpdate = async (isAdd = false) => {
    const payload = isAdd ? addData : editData;

    if (isAdd && !payload.id) {
      Swal.fire("Warning", "Please select a customer first", "warning");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}update_nominee.php`, payload);

      if (res.data.status === "success") {
        Swal.fire("Success!", isAdd ? "Nominee added successfully." : "Nominee details updated.", "success");
        if (isAdd) setAddOpen(false);
        else setOpen(false);
        fetchData();
      } else {
        Swal.fire("Error", res.data.message || "Failed to save", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server connection error", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Remove Nominee?",
      text: "This will clear nominee data for this customer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Clear It",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${API_BASE}delete_nominee.php`, { id });
        if (res.data.status === "success") {
          Swal.fire("Cleared!", "Nominee data removed.", "success");
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredNominees = customers.filter(
    (item) =>
      item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.includes(searchTerm) ||
      item.nominee_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedNominees = filteredNominees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f1f5f9", minHeight: "100vh" }}>

      {/* Header Area with Add Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ color: "#475569", fontWeight: "bold" }}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddOpen}
          sx={{ bgcolor: "#004c8f" }}
        >
          Add Nominee
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by Customer, Phone or Nominee..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            bgcolor: "white",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: "#e2e8f0" },
              "&:hover fieldset": { borderColor: "#004c8f" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94a3b8" }} />
              </InputAdornment>
            ),
            sx: { height: "50px" },
          }}
        />
      </Box>

      {/* Table & Pagination */}
      <Paper sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: "#004c8f" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold", width: "5%" }}>SR.</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>CUSTOMER NAME</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>CUSTOMER PHONE</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>NOMINEE NAME</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>RELATIONSHIP</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>NOMINEE INFO</TableCell>
                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedNominees.map((row, index) => {
                const actualIndex = page * rowsPerPage + index + 1;
                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ bgcolor: index % 2 === 0 ? "#ffffff" : "#fdfdfd" }}
                  >
                    <TableCell sx={{ color: "#64748b" }}>{actualIndex}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{row.customer_name}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell sx={{ color: "#004c8f", fontWeight: 700 }}>
                      {row.nominee_name || "---"}
                    </TableCell>
                    <TableCell>{row.nominee_relation || "---"}</TableCell>
                    <TableCell>
                      <Box sx={{ fontSize: "0.85rem" }}>
                        <div><b>ID:</b> {row.nominee_id || "-"}</div>
                        <div><b>Ph:</b> {row.nominee_contact || "-"}</div>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton size="small" color="info" onClick={() => handleViewOpen(row)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary" onClick={() => handleEditOpen(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#d97706" }} onClick={() => handleOpenNotesModal(row)}>
                          <NoteAltIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}

              {paginatedNominees.length === 0 && (
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
          count={filteredNominees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid #e2e8f0" }}
        />
      </Paper>

      {/* --- ADD NOMINEE MODAL --- */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Box
          sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 600, md: 800 }, bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4, outline: "none"
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f" }}>
              Add New Nominee
            </Typography>
            <IconButton onClick={() => setAddOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Customer Selection Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                label="Select Customer *"
                fullWidth
                value={addData.id}
                onChange={(e) => setAddData({ ...addData, id: e.target.value })}
                helperText="Only showing customers who do not have a nominee yet."
              >
                {customersWithoutNominee.length === 0 && (
                  <MenuItem disabled value="">No pending customers available</MenuItem>
                )}
                {customersWithoutNominee.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.customer_name} (Ph: {customer.phone})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Form Fields */}
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee Name *" placeholder="Nominee's full name" fullWidth value={addData.nominee_name} onChange={(e) => setAddData({ ...addData, nominee_name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee Relationship *" placeholder="e.g. Spouse, Father" fullWidth value={addData.nominee_relation} onChange={(e) => setAddData({ ...addData, nominee_relation: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee PAN / Aadhaar" placeholder="Enter ID Number" fullWidth value={addData.nominee_id} onChange={(e) => setAddData({ ...addData, nominee_id: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee Contact Number" placeholder="Phone Number" fullWidth value={addData.nominee_contact} onChange={(e) => setAddData({ ...addData, nominee_contact: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee Email ID" placeholder="email@example.com" fullWidth value={addData.nominee_email} onChange={(e) => setAddData({ ...addData, nominee_email: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Bank Details (Cheque / Passbook)" placeholder="Account No, IFSC, Bank Name" fullWidth value={addData.bank_details} onChange={(e) => setAddData({ ...addData, bank_details: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Nominee Dynamic Notes" placeholder="Enter additional information here..." fullWidth multiline minRows={3} value={addData.nominee_notes} onChange={(e) => setAddData({ ...addData, nominee_notes: e.target.value })} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button sx={{ color: "#004c8f" }} onClick={() => setAddOpen(false)}>CANCEL</Button>
            <Button variant="contained" onClick={() => handleUpdate(true)} disabled={!addData.id} sx={{ bgcolor: "#004c8f", px: 4, fontWeight: "bold", boxShadow: "none" }}>
              SAVE NOMINEE
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* --- EDIT NOMINEE MODAL --- */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 600, md: 800 }, bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4, outline: "none"
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f" }}>
              Edit Nominee Details
            </Typography>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="body2" sx={{ color: "error.main", fontWeight: "bold", mb: 3, fontStyle: "italic" }}>
            NOTE: Please fill necessary fields marked *
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee Name *" placeholder="Nominee's full name" fullWidth value={editData.nominee_name} onChange={(e) => setEditData({ ...editData, nominee_name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee Relationship *" placeholder="e.g. Spouse, Father" fullWidth value={editData.nominee_relation} onChange={(e) => setEditData({ ...editData, nominee_relation: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee PAN / Aadhaar" placeholder="Enter ID Number" fullWidth value={editData.nominee_id} onChange={(e) => setEditData({ ...editData, nominee_id: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee Contact Number" placeholder="Phone Number" fullWidth value={editData.nominee_contact} onChange={(e) => setEditData({ ...editData, nominee_contact: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nominee Email ID" placeholder="email@example.com" fullWidth value={editData.nominee_email} onChange={(e) => setEditData({ ...editData, nominee_email: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Bank Details (Cheque / Passbook)" placeholder="Account No, IFSC, Bank Name" fullWidth value={editData.bank_details} onChange={(e) => setEditData({ ...editData, bank_details: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Nominee Dynamic Notes" placeholder="Enter additional information here..." fullWidth multiline minRows={3} value={editData.nominee_notes} onChange={(e) => setEditData({ ...editData, nominee_notes: e.target.value })} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button sx={{ color: "#004c8f" }} onClick={() => setOpen(false)}>BACK</Button>
            <Button variant="contained" onClick={() => handleUpdate(false)} sx={{ bgcolor: "#004c8f", px: 4, fontWeight: "bold", boxShadow: "none" }}>
              SAVE & UPDATE
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* --- VIEW NOMINEE MODAL --- */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box
          sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 500 }, bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4, outline: "none"
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f" }}>
              Nominee Details
            </Typography>
            <IconButton onClick={() => setViewOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {selectedNominee && (
            <Stack spacing={2}>
              <Box><Typography variant="caption" color="text.secondary">Nominee Name</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_name || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Relationship</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_relation || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">PAN / Aadhaar</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_id || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Contact Number</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_contact || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Email ID</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_email || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Bank Details</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.bank_details || "N/A"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Notes</Typography><Typography variant="body1" fontWeight={600}>{selectedNominee.nominee_notes || "N/A"}</Typography></Box>
            </Stack>
          )}
        </Box>
      </Modal>
      {/* --- QUICK NOTES ONLY MODAL --- */}
      <Modal open={openNotes} onClose={() => setOpenNotes(false)}>
        <Box
          sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: "85%", md: 900 }, bgcolor: "#fff", borderRadius: 4, boxShadow: "0 25px 50px rgba(0,0,0,0.2)", outline: "none",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: { xs: 2, sm: 3 }, borderBottom: "1px solid #f1f5f9", bgcolor: "#fffbeb" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#d97706", display: 'flex', alignItems: 'center', gap: 1 }}>
              <NoteAltIcon /> Nominee Notes
            </Typography>
            <IconButton onClick={() => setOpenNotes(false)}><CloseIcon /></IconButton>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <TextField
              fullWidth multiline minRows={5} maxRows={10} autoFocus
              label={notesData.nominee_notes ? "Edit Notes" : "Add New Note"}
              name="nominee_notes"
              value={notesData.nominee_notes}
              onChange={(e) => setNotesData({ ...notesData, nominee_notes: e.target.value })}
              placeholder="Type your important notes, reminders, or updates about this nominee here..."
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fafafa", fontSize: "0.95rem" } }}
            />

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button sx={{ color: "#64748b" }} onClick={() => setOpenNotes(false)}>CANCEL</Button>
              <Button variant="contained" sx={{ bgcolor: "#d97706", '&:hover': { bgcolor: "#b45309" }, boxShadow: "none", fontWeight: "bold", px: 3 }} onClick={handleNotesSubmit}>
                SAVE NOTE
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal >
    </Box >
  );
};

export default NomineeList;