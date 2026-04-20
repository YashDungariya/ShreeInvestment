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
  Chip,
  IconButton,
  Stack,
  Avatar,
  Tabs,
  Tab,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);

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

  const handleUploadDoc = async (id, docType, isUpdate = false) => {
    const { value: file } = await Swal.fire({
      title: isUpdate
        ? `Update Document`
        : `Upload Document`,
      input: "file",
      inputAttributes: { accept: "image/*,application/pdf" },
      showCancelButton: true,
      confirmButtonColor: "#004c8f",
    });

    if (file) {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("docType", docType); // Using dynamic docType (e.g., nominee_doc_id_proof)
      formData.append("newFile", file);
      try {
        const res = await axios.post(
          `${API_BASE}update_document.php`,
          formData
        );
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

  const handleDeleteDoc = async (id, docType) => {
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
        });
        if (res.data.status === "success") {
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredDocs = customers.filter(
    (c) =>
      c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Helper to render document cell
  const RenderDocCell = (row, type, label) => {
    const file = row[type];
    if (!file) {
      return (
        <Button
          size="small"
          startIcon={<CloudUploadIcon />}
          onClick={() => handleUploadDoc(row.id, type, false)}
          sx={{
            color: "#94a3b8",
            textTransform: "none",
            fontSize: "12px",
            border: "1px dashed #cbd5e1",
            borderRadius: "8px",
            width: "100px",
          }}
        >
          Upload
        </Button>
      );
    }
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#f8fafc",
          borderRadius: "8px",
          p: "4px 8px",
          width: "fit-content",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: "#475569", mr: 1 }}
        >
          {label}
        </Typography>
        <Stack direction="row" spacing={0}>
          <IconButton
            size="small"
            onClick={() => window.open(`${API_BASE}uploads/${file}`)}
            color="primary"
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleUploadDoc(row.id, type, true)}
            color="warning"
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteDoc(row.id, type)}
            color="error"
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f7fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ color: "#475569", fontWeight: "bold" }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 4,
          bgcolor: "white",
          borderRadius: "12px",
          "& fieldset": { border: "none" },
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#004c8f" }} />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { backgroundColor: "#004c8f", height: "3px" } }}
          sx={{ "& .Mui-selected": { color: "#004c8f !important", fontWeight: "bold" } }}
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label="Customer Documents" />
          <Tab icon={<GroupIcon />} iconPosition="start" label="Nominee Documents" />
        </Tabs>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                CUSTOMER / NOMINEE
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                ID PROOF
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                PAN
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                BANK
              </TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                PHOTO
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 800, color: "#64748b" }}
              >
                STATUS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocs.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ "&:last-child td": { border: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: tabValue === 0 ? "#004c8f" : "#ff8c00", fontSize: "14px" }}>
                      {tabValue === 0 ? row.customer_name?.charAt(0) : (row.nominee_name ? row.nominee_name.charAt(0) : "N")}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {tabValue === 0 ? row.customer_name : (row.nominee_name || "No Nominee Added")}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {tabValue === 0 ? row.phone : `Relation: ${row.nominee_relation || "N/A"}`}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {tabValue === 0 ? (
                  // CUSTOMER DOCUMENTS TAB
                  <>
                    <TableCell>{RenderDocCell(row, "doc_id_proof", "ID")}</TableCell>
                    <TableCell>{RenderDocCell(row, "doc_pan", "PAN")}</TableCell>
                    <TableCell>{RenderDocCell(row, "doc_bank", "BNK")}</TableCell>
                    <TableCell>{RenderDocCell(row, "doc_photo", "IMG")}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.doc_id_proof && row.doc_pan && row.doc_bank && row.doc_photo ? "Done" : "Pending"}
                        size="small"
                        sx={{
                          fontWeight: 900,
                          bgcolor: row.doc_id_proof && row.doc_pan && row.doc_bank && row.doc_photo ? "#dcfce7" : "#fee2e2",
                          color: row.doc_id_proof && row.doc_pan && row.doc_bank && row.doc_photo ? "#166534" : "#991b1b",
                        }}
                      />
                    </TableCell>
                  </>
                ) : (
                  // NOMINEE DOCUMENTS TAB
                  <>
                    <TableCell>{RenderDocCell(row, "nominee_doc_id_proof", "ID")}</TableCell>
                    <TableCell>{RenderDocCell(row, "nominee_doc_pan", "PAN")}</TableCell>
                    <TableCell>{RenderDocCell(row, "nominee_doc_bank", "BNK")}</TableCell>
                    <TableCell>{RenderDocCell(row, "nominee_doc_photo", "IMG")}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.nominee_doc_id_proof && row.nominee_doc_photo ? "Done" : "Pending"}
                        size="small"
                        sx={{
                          fontWeight: 900,
                          bgcolor: row.nominee_doc_id_proof && row.nominee_doc_photo ? "#dcfce7" : "#fee2e2",
                          color: row.nominee_doc_id_proof && row.nominee_doc_photo ? "#166534" : "#991b1b",
                        }}
                      />
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DocumentManager;
