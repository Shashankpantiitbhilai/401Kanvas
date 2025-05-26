const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { protect } = require('../middleware/auth');
const Report = require('../models/Report');
const path = require('path');
const fs = require('fs');

// Configure multer for Excel file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/excel';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.xlsx' && ext !== '.xls') {
            return cb(new Error('Only Excel files are allowed'));
        }
        cb(null, true);
    }
});

// Upload and parse Excel file
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // Read Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Process the data
        const fundData = data.map(row => ({
            name: row['Fund Name'],
            symbol: row['Symbol'],
            returns: {
                oneMonth: parseFloat(row['1 Mo Return']) || 0,
                threeMonth: parseFloat(row['3 Mo Return']) || 0,
                sixMonth: parseFloat(row['6 Mo Return']) || 0,
                twelveMonth: parseFloat(row['12 Mo Return']) || 0,
                ytd: parseFloat(row['YTD Return']) || 0
            },
            trackerAverage: parseFloat(row['Tracker Average']) || 0
        }));

        // Create new report
        const report = new Report({
            company: req.body.companyId,
            date: new Date(),
            fundData,
            createdBy: req.user._id
        });

        await report.save();

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({ 
            message: 'File uploaded and processed successfully',
            reportId: report._id,
            fundData 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error processing file', error: err.message });
    }
});

// Generate PDF report
router.post('/:id/generate-pdf', protect, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('company')
            .populate('createdBy');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // TODO: Implement actual PDF generation using pdfmake
        // For now, return a mock PDF response
        res.json({
            message: 'PDF generated successfully',
            pdfUrl: `/reports/${report._id}/newsletter.pdf`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating PDF' });
    }
});

// Get all reports
router.get('/', protect, async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('company', 'name')
            .populate('createdBy', 'email')
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 