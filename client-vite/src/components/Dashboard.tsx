import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Company {
  _id: string;
  name: string;
}

interface Report {
  id: string;
  date: string;
  company: string;
  status: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Implement API calls
      setReports([]);
      setCompanies([]);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!selectedCompany) {
      setError('Please select a company first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      // TODO: Implement file upload
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'company', headerName: 'Company', width: 200 },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/reports/${params.row.id}`)}
          >
            View
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/reports/${params.row.id}/edit`)}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            401(k) Newsletter Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Company</InputLabel>
              <Select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                label="Select Company"
              >
                {companies.map((company) => (
                  <MenuItem key={company._id} value={company._id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              component="label"
              disabled={uploading || !selectedCompany}
            >
              {uploading ? 'Uploading...' : 'Upload Excel'}
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate('/templates')}
            >
              Manage Templates
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Reports History
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={reports}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 