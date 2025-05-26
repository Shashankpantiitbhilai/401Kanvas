const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create test admin user
router.post('/create-test-admin', async (req, res) => {
    try {
        // Check if admin already exists
        let admin = await User.findOne({ email: 'admin@example.com' });
        if (admin) {
            return res.json({ message: 'Admin user already exists', success: true });
        }

        // Create admin user
        admin = new User({
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        await admin.save();
        res.json({ message: 'Admin user created successfully', success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, password, role, company } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            email,
            password,
            role,
            company
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 