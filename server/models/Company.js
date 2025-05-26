const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String, // URL to logo image
    },
    template: {
        modelPortfolios: {
            aggressive: [{
                fundName: String,
                allocation: Number
            }],
            moderate: [{
                fundName: String,
                allocation: Number
            }],
            conservative: [{
                fundName: String,
                allocation: Number
            }]
        },
        defaultCommentary: {
            marketSummary: String,
            indexAnalysis: String,
            fixedIncomeUpdate: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Company', companySchema); 