import React from 'react';

const AssignmentsManagement = ({ 
  assignments, 
  showAssignmentForm, 
  setShowAssignmentForm, 
  newAssignment, 
  setNewAssignment, 
  handleCreateAssignment, 
  handleDeleteAssignment,
  auditors,
  vendors 
}) => {
  return (
    <div className="card">
      <div className="card-header flex-between">
        <h3 className="card-title">Vendor-Auditor Assignments</h3>
        <button
          onClick={() => setShowAssignmentForm(!showAssignmentForm)}
          className="btn btn-success"
        >
          Create Assignment
        </button>
      </div>

      {showAssignmentForm && (
        <form onSubmit={handleCreateAssignment} className="mb-6" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <select
                className="form-select"
                value={newAssignment.auditorId}
                onChange={(e) => setNewAssignment({ ...newAssignment, auditorId: e.target.value })}
                required
              >
                <option value="">Select Auditor</option>
                {auditors.map((auditor) => (
                  <option key={auditor._id} value={auditor._id}>{auditor.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select
                className="form-select"
                value={newAssignment.vendorId}
                onChange={(e) => setNewAssignment({ ...newAssignment, vendorId: e.target.value })}
                required
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>{vendor.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-success">
              Create Assignment
            </button>
            <button
              type="button"
              onClick={() => setShowAssignmentForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Auditor</th>
            <th>Vendor</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{assignment.auditor?.name}</td>
              <td>{assignment.vendor?.name}</td>
              <td>
                {new Date(assignment.createdAt).toLocaleDateString()}
              </td>
              <td>
                <button
                  onClick={() => handleDeleteAssignment(assignment._id)}
                  className="btn btn-danger"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsManagement;