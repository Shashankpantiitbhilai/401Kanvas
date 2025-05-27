const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    fund: {
        type: String,
        required: true
    },
    allocation: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
});

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
    },
    templates: {
        aggressive: [portfolioSchema],
        moderate: [portfolioSchema],
        conservative: [portfolioSchema]
        },
        defaultCommentary: {
        type: String
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
companySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Company', companySchema); 