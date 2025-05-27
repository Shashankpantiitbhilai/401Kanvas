import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  TablePagination,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

// Mock data - replace with actual API call
const mockReports = [
  {
    id: 1,
    company: 'Air Wisconsin',
    date: '2024-03-15',
    type: 'Monthly Newsletter',
    status: 'Published',
  },
  {
    id: 2,
    company: 'Delta Airlines',
    date: '2024-03-14',
    type: 'Quarterly Review',
    status: 'Draft',
  },
  // Add more mock data as needed
];

const ReportsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredReports = mockReports.filter(
    (report) =>
      report.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by company or report type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="reports table">
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((report) => (
                <TableRow
                  key={report.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {report.company}
                  </TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      aria-label="view report"
                      onClick={() => console.log('View report:', report.id)}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      aria-label="download report"
                      onClick={() => console.log('Download report:', report.id)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredReports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ReportsTable; 