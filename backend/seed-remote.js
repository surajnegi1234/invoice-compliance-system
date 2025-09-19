const mongoose = require('mongoose');
const { getTenantConnection } = require('./src/models/database');
const { getTenantModels } = require('./src/middleware/tenant');
const Tenant = require('./src/models/Tenant');

const seedRemote = async () => {
  try {
    await mongoose.connect('mongodb+srv://testuser:testuser123@cluster0.uxzotsx.mongodb.net/invoice_compliance?retryWrites=true&w=majority&appName=Cluster0');
    console.log('connected to remote db');

    await Tenant.deleteMany({});
    
    await Tenant.create({
      name: 'Default Organization',
      slug: 'default',
      domain: 'localhost',
      isActive: true
    });

    await Tenant.create({
      name: 'ABC Corporation',
      slug: 'abc',
      domain: 'abc.localhost',
      isActive: true
    });

    await seedTenant('default');
    console.log('remote db seeded');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

const seedTenant = async (tenantId) => {
  const tenantConnection = getTenantConnection(tenantId);
  const models = getTenantModels(tenantConnection);

  await models.User.deleteMany({});

  await models.User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  });

  await models.User.create({
    name: 'Auditor User',
    email: 'auditor@test.com',
    password: 'auditor123',
    role: 'auditor'
  });

  await models.User.create({
    name: 'Vendor One',
    email: 'vendor@test.com',
    password: 'vendor123',
    role: 'vendor'
  });

  await models.User.create({
    name: 'Vendor Two',
    email: 'vendor2@test.com',
    password: 'vendor123',
    role: 'vendor'
  });
};

seedRemote();