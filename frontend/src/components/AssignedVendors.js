import React from 'react';

const AssignedVendors = ({ vendors, setSelectedVendor, setShowReminderModal }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Assigned Vendors</h3>
      </div>
      <div className="grid grid-cols-3">
        {vendors.map((vendor) => (
          <div key={vendor._id} className="card">
            <h4>{vendor.name}</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>{vendor.email}</p>
            <p style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
              Assigned: {new Date(vendor.assignedAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => {
                setSelectedVendor(vendor);
                setShowReminderModal(true);
              }}
              className="btn btn-outline mt-4"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Send Reminder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedVendors;