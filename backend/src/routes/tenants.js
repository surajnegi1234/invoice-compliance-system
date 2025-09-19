const express = require('express');
const Tenant = require('../models/Tenant');

const router = express.Router();

//tentant
router.post('/', async (req, res) => {
  try {
    const { name, slug, domain } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    const existingTenant = await Tenant.findOne({ slug });
    if (existingTenant) {
      return res.status(400).json({ message: 'Tenant slug already exists' });
    }

    const tenant = await Tenant.create({ name, slug, domain });
    res.status(201).json(tenant);
  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tenants
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(tenants);
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;