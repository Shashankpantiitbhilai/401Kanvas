const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect, admin } = require('../middleware/auth');

// Get all reports for a user
router.get('/', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id });
    res.json(reports);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get a single report
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create a report
router.post('/', protect, async (req, res) => {
  try {
    const newReport = new Report({
      ...req.body,
      user: req.user.id
    });
    const report = await newReport.save();
    res.json(report);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update a report
router.put('/:id', protect, async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    report = await Report.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(report);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a report — admin only
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }
    await report.remove();
    res.json({ msg: 'Report removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
