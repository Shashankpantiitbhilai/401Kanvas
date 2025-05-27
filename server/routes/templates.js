const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Company = require('../models/Company');

// Get all company templates
router.get('/', auth, async (req, res) => {
  try {
    const companies = await Company.find().select('name logo templates');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new company template
router.post('/', auth, async (req, res) => {
  try {
    const { companyName, logo, aggressive, moderate, conservative, defaultCommentary } = req.body;

    // Validate portfolio allocations
    const validatePortfolio = (portfolio) => {
      if (!Array.isArray(portfolio)) {
        throw new Error('Portfolio must be an array');
      }

      const total = portfolio.reduce((sum, item) => sum + Number(item.allocation), 0);
      if (total !== 100) {
        throw new Error('Portfolio allocations must total 100%');
      }
    };

    validatePortfolio(aggressive);
    validatePortfolio(moderate);
    validatePortfolio(conservative);

    const company = new Company({
      name: companyName,
      logo,
      templates: {
        aggressive,
        moderate,
        conservative
      },
      defaultCommentary
    });

    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single company template
router.get('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a company template
router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'logo', 'templates', 'defaultCommentary'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    // If updating templates, validate portfolio allocations
    if (req.body.templates) {
      const { aggressive, moderate, conservative } = req.body.templates;
      const validatePortfolio = (portfolio) => {
        if (!Array.isArray(portfolio)) {
          throw new Error('Portfolio must be an array');
        }

        const total = portfolio.reduce((sum, item) => sum + Number(item.allocation), 0);
        if (total !== 100) {
          throw new Error('Portfolio allocations must total 100%');
        }
      };

      if (aggressive) validatePortfolio(aggressive);
      if (moderate) validatePortfolio(moderate);
      if (conservative) validatePortfolio(conservative);
    }

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    updates.forEach(update => {
      company[update] = req.body[update];
    });

    await company.save();
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a company template
router.delete('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 