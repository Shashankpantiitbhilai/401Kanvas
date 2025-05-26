const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb+srv://shashankpant94115:ST0Io2DYTc1I1on6@cluster0.3alwvln.mongodb.net/newsletter_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
const excelDir = path.join(uploadDir, 'excel');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(excelDir)) {
    fs.mkdirSync(excelDir);
}

// File Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, excelDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/companies', require('./routes/companies'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 