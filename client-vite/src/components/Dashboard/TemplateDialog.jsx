import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const TemplateDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    logo: '',
    aggressive: [{ fund: '', allocation: '' }],
    moderate: [{ fund: '', allocation: '' }],
    conservative: [{ fund: '', allocation: '' }],
    defaultCommentary: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePortfolioChange = (type, index, field, value) => {
    setFormData({
      ...formData,
      [type]: formData[type].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const addPortfolioItem = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { fund: '', allocation: '' }],
    });
  };

  const removePortfolioItem = (type, index) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');

    try {
      // Validate total allocations
      ['aggressive', 'moderate', 'conservative'].forEach(type => {
        const total = formData[type].reduce((sum, item) => sum + Number(item.allocation), 0);
        if (total !== 100) {
          throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} portfolio allocations must total 100%`);
        }
      });

      // Replace with actual API call
      const response = await fetch('http://localhost:5000/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderPortfolioSection = (type, title) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {formData[type].map((item, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Fund Name"
              value={item.fund}
              onChange={(e) => handlePortfolioChange(type, index, 'fund', e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              label="Allocation %"
              value={item.allocation}
              onChange={(e) => handlePortfolioChange(type, index, 'allocation', e.target.value)}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={() => removePortfolioItem(type, index)}
              disabled={formData[type].length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => addPortfolioItem(type)}
        sx={{ mt: 1 }}
      >
        Add Fund
      </Button>
    </Box>
  );

  return (
    <Dialog open={open} onClose={!saving ? onClose : undefined} maxWidth="md" fullWidth>
      <DialogTitle>Create Company Template</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Logo URL"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        {renderPortfolioSection('aggressive', 'Aggressive Portfolio')}
        {renderPortfolioSection('moderate', 'Moderate Portfolio')}
        {renderPortfolioSection('conservative', 'Conservative Portfolio')}

        <Divider sx={{ my: 2 }} />

        <TextField
          fullWidth
          label="Default Commentary"
          name="defaultCommentary"
          value={formData.defaultCommentary}
          onChange={handleChange}
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Template'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateDialog; 