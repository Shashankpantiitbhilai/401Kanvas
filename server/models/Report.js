const mongoose = require('mongoose');

const fundPerformanceSchema = new mongoose.Schema({
    fundName: {
        type: String,
        required: true
    },
    symbol: String,
    returns: {
        oneMonth: Number,
        threeMonth: Number,
        sixMonth: Number,
        twelveMonth: Number,
        ytd: Number
    },
    trackerAverage: Number
});

const reportSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    type: {
        type: String,
        required: true,
        enum: ['Monthly Newsletter', 'Quarterly Review']
    },
    status: {
        type: String,
        required: true,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    },
    content: {
        marketCommentary: String,
        indexAnalysis: String,
        fixedIncomeUpdate: String,
        customNotes: String
    },
    fundPerformance: [fundPerformanceSchema],
    modelPortfolios: {
        aggressive: [{
            fund: String,
            allocation: Number,
            performance: Number
        }],
        moderate: [{
            fund: String,
            allocation: Number,
            performance: Number
        }],
        conservative: [{
            fund: String,
            allocation: Number,
            performance: Number
        }]
    },
    pdfUrl: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
reportSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Report', reportSchema); 