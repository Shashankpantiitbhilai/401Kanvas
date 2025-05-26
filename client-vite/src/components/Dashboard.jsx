import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { uploadExcel, getReports, getCompanies } from '../services/api';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Select, MenuItem, FormControl, InputLabel, Box, Container, Typography, Paper, AppBar, Toolbar } from '@mui/material';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [companies, setCompanies] = useState([]);
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
            const [reportsData, companiesData] = await Promise.all([
                getReports(),
                getCompanies()
            ]);
            setReports(reportsData);
            setCompanies(companiesData);
        } catch (err) {
            setError('Failed to fetch data');
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!selectedCompany) {
            setError('Please select a company first');
            return;
        }

        try {
            setUploading(true);
            setError('');
            await uploadExcel(file, selectedCompany);
            await fetchData(); // Refresh the reports list
        } catch (err) {
            setError(err.message || 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const columns = [
        { field: 'date', headerName: 'Date', width: 200 },
        { field: 'company', headerName: 'Company', width: 200 },
        { field: 'status', headerName: 'Status', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate(`/reports/${params.row.id}`)}
                        className="btn-primary text-sm py-1"
                    >
                        View
                    </button>
                    <button
                        onClick={() => navigate(`/reports/${params.row.id}/edit`)}
                        className="btn-secondary text-sm py-1"
                    >
                        Edit
                    </button>
                </div>
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
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Welcome to your Dashboard
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Here you can manage your 401(k) newsletters and reports.
                    </Typography>
                </Paper>
            </Container>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <FormControl className="min-w-[200px]">
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

                        <div>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="excel-upload"
                                disabled={uploading || !selectedCompany}
                            />
                            <label
                                htmlFor="excel-upload"
                                className={`btn-primary cursor-pointer inline-block ${
                                    (uploading || !selectedCompany) && 'opacity-50 cursor-not-allowed'
                                }`}
                            >
                                {uploading ? 'Uploading...' : 'Upload Excel'}
                            </label>
                        </div>

                        <button
                            onClick={() => navigate('/templates')}
                            className="btn-secondary"
                        >
                            Manage Templates
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Reports History</h2>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={reports}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            disableSelectionOnClick
                        />
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default Dashboard; 