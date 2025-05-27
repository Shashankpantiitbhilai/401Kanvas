import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import ReportsTable from './ReportsTable';
import UploadDialog from './UploadDialog';
import TemplateDialog from './TemplateDialog';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            401Kanvas
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              Welcome, {user?.username}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Action Buttons */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUploadOpen(true)}
              >
                Upload Report
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => setTemplateOpen(true)}
              >
                Create Template
              </Button>
            </Paper>
          </Grid>

          {/* Reports Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Report History
              </Typography>
              <ReportsTable />
            </Paper>
          </Grid>
        </Grid>

        {/* Dialogs */}
        <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
        <TemplateDialog open={templateOpen} onClose={() => setTemplateOpen(false)} />
      </Container>
    </Box>
  );
};

export default Dashboard; 