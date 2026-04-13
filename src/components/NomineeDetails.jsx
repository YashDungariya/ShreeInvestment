import React from "react";
import { Grid, TextField, Typography, Divider } from "@mui/material";

const NomineeDetails = ({ formData, handleChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" color="secondary" gutterBottom>
          Nominee & Bank Details
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nominee Name"
          name="nomineeName"
          value={formData.nomineeName}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nominee Relation"
          name="nomineeRelation"
          value={formData.nomineeRelation}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nominee PAN / Aadhaar"
          name="nomineeId"
          value={formData.nomineeId}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nominee Contact (Email/Phone)"
          name="nomineeContact"
          value={formData.nomineeContact}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 1 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Folio No."
          name="folioNo"
          value={formData.folioNo}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          multiline
          rows={2}
          label="Bank Details (Cheque / Passbook Info)"
          name="bankDetails"
          value={formData.bankDetails}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Grid>
    </Grid>
  );
};

export default NomineeDetails;
