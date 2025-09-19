const mongoose = require('mongoose');

const connections = new Map();

const getTenantConnection = (tenantId) => {
  if (connections.has(tenantId)) {
    return connections.get(tenantId);
  }

  const dbName = `invoice_compliance_${tenantId}`;
  const connection = mongoose.createConnection(
    process.env.MONGODB_URI.replace('/invoice_compliance', `/${dbName}`)
  );

  connections.set(tenantId, connection);
  console.log(`Connected to tenant database: ${dbName}`);
  
  return connection;
};

const getSharedConnection = async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to shared database');
  }
  return mongoose.connection;
};

const closeTenantConnection = (tenantId) => {
  if (connections.has(tenantId)) {
    connections.get(tenantId).close();
    connections.delete(tenantId);
  }
};

module.exports = {
  getTenantConnection,
  getSharedConnection,
  closeTenantConnection
};