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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NomineeList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE = "https://lightyellow-mole-663257.hostingersite.com/api/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}get_customers.php`);
      setCustomers(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Search Logic
  const filteredNominees = customers.filter(
    (item) =>
      item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.includes(searchTerm) ||
      item.nominee_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box sx={{ p: 3, bgcolor: "#f1f5f9", minHeight: "100vh" }}>
      {/* Header Area */}

      {/* --- PROFESSIONAL RECTANGULAR SEARCH INPUT --- */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by Customer Name, Phone or Nominee Name..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            bgcolor: "white",
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px", // Normal professional radius
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

      {/* --- LIGHT WHITE THEMED TABLE --- */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
          bgcolor: "#fafafa", // Light white color
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: "#004c8f" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", py: 2 }}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNominees.length > 0 ? (
              filteredNominees.map((row, index) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    bgcolor: index % 2 === 0 ? "#ffffff" : "#fdfdfd", // Subtle alternating white
                    "&:hover": { bgcolor: "#f8fafc !important" },
                  }}
                >
                  <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#334155" }}>
                    {row.customer_name}
                  </TableCell>
                  <TableCell sx={{ color: "#475569" }}>{row.phone}</TableCell>
                  <TableCell sx={{ color: "#004c8f", fontWeight: 700 }}>
                    {row.nominee_name || "---"}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: "#64748b" }}
                    >
                      {row.nominee_relation || "---"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontSize: "0.85rem" }}>
                      <div style={{ color: "#334155" }}>
                        <b>ID:</b> {row.nominee_id || "-"}
                      </div>
                      <div style={{ color: "#64748b" }}>
                        <b>Ph:</b> {row.nominee_contact || "-"}
                      </div>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 6, color: "#94a3b8" }}
                >
                  No records matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NomineeList;
