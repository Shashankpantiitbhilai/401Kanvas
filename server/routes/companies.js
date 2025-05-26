const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Company = require('../models/Company');

// Create company (Admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all companies
router.get('/', protect, async (req, res) => {
    try {
        const companies = await Company.find().sort('name');
        res.json(companies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get company by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update company template
router.put('/:id/template', protect, async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        company.template = {
            ...company.template,
            ...req.body
        };

        await company.save();
        res.json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update company
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        
        res.json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 