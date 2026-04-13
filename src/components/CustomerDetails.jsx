import React from "react";
import { Grid, TextField, Typography } from "@mui/material";

const CustomerDetails = ({ formData, handleChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" color="secondary" gutterBottom>
          Personal Information
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Customer Name"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          variant="outlined"
          size="small"
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Mother's Name"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email ID"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          variant="outlined"
          size="small"
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Birth Place"
          name="birthPlace"
          value={formData.birthPlace}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Dynamic Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          variant="outlined"
          size="small"
          multiline
          rows={1}
        />
      </Grid>
    </Grid>
  );
};

export default CustomerDetails;
