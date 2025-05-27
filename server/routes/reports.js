const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const Company = require('../models/Company');

// Configure multer for Excel file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only Excel files (.xlsx or .xls)'));
    }
  },
});

// Get all reports (with pagination and filtering)
router.get('/', auth, (req, res) => {
  const { page = 1, limit = 10, company, type, status } = req.query;
  const query = {};

  if (company) query.company = company;
  if (type) query.type = type;
  if (status) query.status = status;

  Report.find(query)
    .populate('company', 'name')
    .sort({ date: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .exec((err, reports) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      Report.countDocuments(query, (err, count) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.json({
          reports,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          totalReports: count,
        });
      });
    });
});

// Upload and parse Excel file
router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  const { company } = req.body;
  if (!company) {
    return res.status(400).json({ message: 'Company ID is required' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const fundPerformance = data.map(row => ({
      fundName: row['Fund Name'],
      symbol: row['Symbol'],
      returns: {
        oneMonth: parseFloat(row['1 Mo']),
        threeMonth: parseFloat(row['3 Mo']),
        sixMonth: parseFloat(row['6 Mo']),
        twelveMonth: parseFloat(row['12 Mo']),
        ytd: parseFloat(row['YTD'])
      },
      trackerAverage: parseFloat(row['Tracker Average'])
    }));

    const report = new Report({
      company,
      type: 'Monthly Newsletter',
      fundPerformance,
      createdBy: req.user.id
    });

    report.save((err, savedReport) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(201).json(savedReport);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single report
router.get('/:id', auth, (req, res) => {
  Report.findById(req.params.id)
    .populate('company', 'name logo')
    .populate('createdBy', 'username')
    .exec((err, report) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.json(report);
    });
});

// Update report content
router.patch('/:id', auth, (req, res) => {
  const allowedUpdates = [
    'content',
    'modelPortfolios',
    'status',
    'type'
  ];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  Report.findById(req.params.id, (err, report) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    updates.forEach(update => {
      report[update] = req.body[update];
    });

    report.save((err, updatedReport) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      res.json(updatedReport);
    });
  });
});

// Delete a report
router.delete('/:id', auth, (req, res) => {
  Report.findByIdAndDelete(req.params.id, (err, report) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  });
});

module.exports = router; 