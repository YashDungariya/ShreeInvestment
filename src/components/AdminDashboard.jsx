import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Chip,
  Tooltip,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const API_BASE =
    "https://lightyellow-mole-663257.hostingersite.com/api/uploads/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://lightyellow-mole-663257.hostingersite.com/api/get_customers.php",
      );
      setCustomers(res.data);
    } catch (err) {
      console.error("Data fetch error", err);
    }
  };

  const handleDelete = async (idsToDelete) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${idsToDelete.length} record(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(
          "https://lightyellow-mole-663257.hostingersite.com/api/delete_customers.php",
          { ids: idsToDelete },
        );

        if (res.data.status === "success") {
          Swal.fire("Deleted!", res.data.message, "success");
          setSelectedIds([]);
          fetchData();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete records", "error");
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(customers.map((n) => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const HeaderStyle = {
    bgcolor: "#004c8f",
    "& th": {
      color: "white",
      fontWeight: "bold",
      fontSize: "0.90rem",
      whiteSpace: "nowrap",
    },
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f7fa", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#003366" }}>
          CUSTOMER APPLICATIONS PORTAL
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(selectedIds)}
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
          <Chip
            label={`Total: ${customers.length}`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      >
        <Table sx={{ minWidth: 2800 }}>
          <TableHead sx={HeaderStyle}>
            <TableRow>
              <TableCell align="center">
                <Checkbox
                  color="secondary"
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < customers.length
                  }
                  checked={
                    customers.length > 0 &&
                    selectedIds.length === customers.length
                  }
                  onChange={handleSelectAll}
                  sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
                />
              </TableCell>
              <TableCell align="center">Sr. No</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Mother's Name</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Aadhar Number</TableCell>
              <TableCell>PAN Number</TableCell>
              <TableCell>Birth Place</TableCell>
              <TableCell>Nominee Name</TableCell>
              <TableCell>Relationship</TableCell>
              <TableCell>Nominee ID</TableCell>
              <TableCell>Nominee Contact</TableCell>
              <TableCell>Bank Details</TableCell>
              <TableCell>Admin Notes</TableCell>
              <TableCell align="center">Actions / Documents</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:nth-of-type(even)": { bgcolor: "#f9f9f9" },
                  "&:hover": { bgcolor: "#f1f4f8" },
                  bgcolor: selectedIds.includes(row.id) ? "#e3f2fd" : "inherit",
                }}
              >
                <TableCell align="center">
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelectOne(row.id)}
                  />
                </TableCell>
                <TableCell align="center">
                  <b>{index + 1}</b>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {row.customer_name}
                </TableCell>
                <TableCell>{row.mother_name || "-"}</TableCell>
                {/* Database mein column 'emall' hai, toh row.emall use hoga agar backend wahi bhej raha hai */}
                <TableCell>{row.emall || row.email || "-"}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.aadhar_number || "-"}</TableCell>
                <TableCell>{row.pan_number || "-"}</TableCell>
                <TableCell>{row.birth_place || "-"}</TableCell>
                <TableCell>{row.nominee_name || "-"}</TableCell>
                <TableCell>{row.nominee_relation || "-"}</TableCell>
                <TableCell>{row.nominee_id || "-"}</TableCell>
                <TableCell>{row.nominee_contact || "-"}</TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  {row.bank_details || "-"}
                </TableCell>
                <TableCell sx={{ minWidth: 150, fontStyle: "italic" }}>
                  {row.notes || "-"}
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    {row.doc_photo && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          window.open(`${API_BASE}${row.doc_photo}`)
                        }
                      >
                        Photo
                      </Button>
                    )}
                    {row.doc_id_proof && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          window.open(`${API_BASE}${row.doc_id_proof}`)
                        }
                      >
                        Aadhar
                      </Button>
                    )}
                    {row.doc_pan && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => window.open(`${API_BASE}${row.doc_pan}`)}
                      >
                        PAN
                      </Button>
                    )}
                    {row.doc_bank && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() =>
                          window.open(`${API_BASE}${row.doc_bank}`)
                        }
                      >
                        Bank
                      </Button>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete([row.id])}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;
