import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

const UploadDialog = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [company, setCompany] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  // Mock companies - replace with API call
  const companies = [
    { id: 1, name: 'Air Wisconsin' },
    { id: 2, name: 'Delta Airlines' },
    // Add more companies as needed
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please upload only Excel files (.xlsx or .xls)');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !company) {
      setError('Please select both a company and a file');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('company', company);

      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Replace with actual API call
      const response = await fetch('http://localhost:5000/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Clear interval and close dialog on success
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        onClose();
        setSelectedFile(null);
        setCompany('');
        setProgress(0);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to upload file');
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={!uploading ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Excel Report</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="company-select-label">Company</InputLabel>
            <Select
              labelId="company-select-label"
              value={company}
              label="Company"
              onChange={(e) => setCompany(e.target.value)}
              disabled={uploading}
            >
              {companies.map((comp) => (
                <MenuItem key={comp.id} value={comp.id}>
                  {comp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
            component="label"
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <UploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
            <Typography>
              {selectedFile
                ? selectedFile.name
                : 'Drag and drop an Excel file here or click to browse'}
            </Typography>
          </Box>
        </Box>

        {uploading && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              {progress}% Uploaded
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || !company || uploading}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog; 