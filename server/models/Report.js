const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    fundData: [{
        name: String,
        symbol: String,
        returns: {
            oneMonth: Number,
            threeMonth: Number,
            sixMonth: Number,
            twelveMonth: Number,
            ytd: Number
        },
        trackerAverage: Number
    }],
    commentary: {
        marketSummary: String,
        indexAnalysis: String,
        fixedIncomeUpdate: String,
        customNotes: String
    },
    pdfUrl: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema); 