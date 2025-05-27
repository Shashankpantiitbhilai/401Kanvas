import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './components/Dashboard';

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Protected routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        
                        {/* Redirect root to dashboard or login based on auth status */}
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App; 