const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  domain: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    maxUsers: { type: Number, default: 100 },
    maxStorage: { type: Number, default: 1073741824 },
    features: [String]
  }
}, {
  timestamps: true
});

// This model uses the shared database
module.exports = mongoose.model('Tenant', tenantSchema);