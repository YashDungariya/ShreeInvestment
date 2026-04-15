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
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
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
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                SR.
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                CUSTOMER NAME
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                CUSTOMER PHONE
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                NOMINEE NAME
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                RELATIONSHIP
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                NOMINEE INFO
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                ACTION
              </TableCell>
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
                <TableCell sx={{ fontWeight: 700 }}>
                  {row.customer_name}
                </TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell sx={{ color: "#004c8f", fontWeight: 700 }}>
                  {row.nominee_name || "---"}
                </TableCell>
                <TableCell>{row.nominee_relation || "---"}</TableCell>
                <TableCell>
                  <Box sx={{ fontSize: "0.85rem" }}>
                    <div>
                      <b>ID:</b> {row.nominee_id || "-"}
                    </div>
                    <div>
                      <b>Ph:</b> {row.nominee_contact || "-"}
                    </div>
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

      {/* --- EDIT NOMINEE MODAL --- */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Edit Nominee
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={2}>
            <TextField
              label="Nominee Name"
              fullWidth
              value={editData.nominee_name}
              onChange={(e) =>
                setEditData({ ...editData, nominee_name: e.target.value })
              }
            />
            <TextField
              label="Relationship"
              fullWidth
              value={editData.nominee_relation}
              onChange={(e) =>
                setEditData({ ...editData, nominee_relation: e.target.value })
              }
            />
            <TextField
              label="Nominee ID"
              fullWidth
              value={editData.nominee_id}
              onChange={(e) =>
                setEditData({ ...editData, nominee_id: e.target.value })
              }
            />
            <TextField
              label="Contact Number"
              fullWidth
              value={editData.nominee_contact}
              onChange={(e) =>
                setEditData({ ...editData, nominee_contact: e.target.value })
              }
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleUpdate}
              sx={{ bgcolor: "#004c8f", mt: 2 }}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default NomineeList;
