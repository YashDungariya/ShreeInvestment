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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const NomineeList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_id: "",
    nominee_contact: "",
    bank_details: "", // Added Bank Details
  });

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

  const handleEditOpen = (row) => {
    setEditData({
      id: row.id,
      nominee_name: row.nominee_name || "",
      nominee_relation: row.nominee_relation || "",
      nominee_id: row.nominee_id || "",
      nominee_contact: row.nominee_contact || "",
      bank_details: row.bank_details || "", // Populate Bank Details
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.post(`${API_BASE}update_nominee.php`, editData);
      
      if (res.data.status === "success") {
        Swal.fire("Updated!", "Nominee details saved.", "success");
        setOpen(false);
        fetchData();
      } else {
        // Yaha humne res.data.message add kiya hai asli error dekhne ke liye
        Swal.fire("Error", res.data.message || "Failed to update", "error");
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

  return (
    <Box sx={{ p: 3, bgcolor: "#f1f5f9", minHeight: "100vh" }}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ color: "#475569", fontWeight: "bold" }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by Customer, Phone or Nominee..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            bgcolor: "white",
            "& .MuiOutlinedInput-root": { borderRadius: "4px" },
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

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "4px",
          border: "1px solid #e2e8f0",
          bgcolor: "#fafafa",
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: "#004c8f" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>SR.</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>CUSTOMER NAME</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>CUSTOMER PHONE</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>NOMINEE NAME</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>RELATIONSHIP</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>NOMINEE INFO</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNominees.map((row, index) => (
              <TableRow
                key={row.id}
                hover
                sx={{ bgcolor: index % 2 === 0 ? "#ffffff" : "#fdfdfd" }}
              >
                <TableCell sx={{ color: "#64748b" }}>{index + 1}</TableCell>
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
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditOpen(row)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(row.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- EDIT NOMINEE MODAL (UPDATED DESIGN) --- */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 600, md: 800 }, // Modal width increased
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            outline: "none"
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#004c8f" }}>
              Edit Nominee Details
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body2" sx={{ color: "error.main", fontWeight: "bold", mb: 3, fontStyle: "italic" }}>
            NOTE: Please fill necessary fields marked *
          </Typography>

          <Grid container spacing={3}>
            {/* Column 1 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nominee Name *"
                placeholder="Nominee's full name"
                fullWidth
                value={editData.nominee_name}
                onChange={(e) => setEditData({ ...editData, nominee_name: e.target.value })}
              />
            </Grid>
            {/* Column 2 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nominee Relationship *"
                placeholder="e.g. Spouse, Father"
                fullWidth
                value={editData.nominee_relation}
                onChange={(e) => setEditData({ ...editData, nominee_relation: e.target.value })}
              />
            </Grid>

            {/* Column 1 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nominee PAN / Aadhaar"
                placeholder="Enter ID Number"
                fullWidth
                value={editData.nominee_id}
                onChange={(e) => setEditData({ ...editData, nominee_id: e.target.value })}
              />
            </Grid>
            {/* Column 2 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nominee Contact Number"
                placeholder="Phone Number"
                fullWidth
                value={editData.nominee_contact}
                onChange={(e) => setEditData({ ...editData, nominee_contact: e.target.value })}
              />
            </Grid>

            {/* Full Width Row */}
            <Grid item xs={12}>
              <TextField
                label="Bank Details (Cheque / Passbook)"
                placeholder="Account No, IFSC, Bank Name"
                fullWidth
                value={editData.bank_details}
                onChange={(e) => setEditData({ ...editData, bank_details: e.target.value })}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <Button sx={{ color: "#004c8f" }} onClick={() => setOpen(false)}>
                BACK
             </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              sx={{ bgcolor: "#004c8f", px: 4, fontWeight: "bold", boxShadow: "none" }}
            >
              SAVE & NEXT
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default NomineeList;