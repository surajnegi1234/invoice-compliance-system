const mongoose = require('mongoose');
const { getTenantConnection } = require('../src/models/database');
const { getTenantModels } = require('../src/middleware/tenant');
const Tenant = require('../src/models/Tenant');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('mongodb connected');

    await Tenant.deleteMany({});
    
    const defaultTenant = await Tenant.create({
      name: 'Default Organization',
      slug: 'default',
      domain: 'localhost'
    });

    const abcTenant = await Tenant.create({
      name: 'ABC Corporation',
      slug: 'abc',
      domain: 'abc.localhost'
    });

    await seedTenant('default');
    await seedTenant('abc');

    console.log('done! test accounts:');
    console.log('admin@test.com / admin123');
    console.log('auditor@test.com / auditor123');
    console.log('vendor@test.com / vendor123');
    console.log('vendor2@test.com / vendor123');

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
  await models.Document.deleteMany({});
  await models.Assignment.deleteMany({});
  await models.Activity.deleteMany({});

  const admin = await models.User.create({
    name: `${tenantId.toUpperCase()} Administrator`,
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  });

  const auditor = await models.User.create({
    name: `${tenantId.toUpperCase()} Auditor`,
    email: 'auditor@test.com',
    password: 'auditor123',
    role: 'auditor'
  });

  const vendor1 = await models.User.create({
    name: `${tenantId.toUpperCase()} Vendor 1`,
    email: 'vendor@test.com',
    password: 'vendor123',
    role: 'vendor'
  });

  const vendor2 = await models.User.create({
    name: `${tenantId.toUpperCase()} Vendor 2`,
    email: 'vendor2@test.com',
    password: 'vendor123',
    role: 'vendor'
  });
};

seedData();