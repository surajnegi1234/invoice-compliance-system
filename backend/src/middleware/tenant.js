const { getTenantConnection } = require('../models/database');
const { userSchema, documentSchema, assignmentSchema, activitySchema } = require('../models/schemas');
const Tenant = require('../models/Tenant');

const getTenantModels = (connection) => {
  return {
    User: connection.model('User', userSchema),
    Document: connection.model('Document', documentSchema),
    Assignment: connection.model('Assignment', assignmentSchema),
    Activity: connection.model('Activity', activitySchema)
  };
};

const tenantMiddleware = async (req, res, next) => {
  try {
    let tenantId = null;

    const host = req.get('host');
    if (host && host.includes('.')) {
      tenantId = host.split('.')[0];
    } 
    if (!tenantId) {
      tenantId = req.query.tenant;
    }

    if (!tenantId) {
      tenantId = 'default';
    }

    let tenant = await Tenant.findOne({ slug: tenantId, isActive: true });
    if (!tenant && tenantId === 'default') {
     
      tenant = await Tenant.create({
        name: 'Default Organization',
        slug: 'default',
        domain: 'localhost',
        isActive: true
      });
    } else if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    const tenantConnection = getTenantConnection(tenantId);
    req.tenant = {
      id: tenantId,
      info: tenant,
      connection: tenantConnection,
      models: getTenantModels(tenantConnection)
    };

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({ message: 'Tenant resolution failed' });
  }
};

module.exports = { tenantMiddleware, getTenantModels };