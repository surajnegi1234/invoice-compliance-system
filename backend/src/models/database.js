const mongoose = require('mongoose');

const connections = new Map();

const getTenantConnection = (tenantId) => {
  if (connections.has(tenantId)) {
    return connections.get(tenantId);
  }

  const dbName = `invoice_compliance_${tenantId}`;
  let tenantUri = process.env.MONGODB_URI;
  
  // Replace database name in URI
  if (tenantUri.includes('/invoice_compliance?')) {
    tenantUri = tenantUri.replace('/invoice_compliance?', `/${dbName}?`);
  } else if (tenantUri.includes('/invoice_compliance')) {
    tenantUri = tenantUri.replace('/invoice_compliance', `/${dbName}`);
  } else {
    // If no database specified, add it
    tenantUri = tenantUri.replace(/\?/, `/${dbName}?`);
  }
  
  const connection = mongoose.createConnection(tenantUri);
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