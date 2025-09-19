import React from 'react';

const UsersManagement = ({ 
  users, 
  showUserForm, 
  setShowUserForm, 
  newUser, 
  setNewUser, 
  handleCreateUser, 
  handleDeleteUser 
}) => {
  return (
    <div className="card">
      <div className="card-header flex-between">
        <h3 className="card-title">Users Management</h3>
        <button
          onClick={() => setShowUserForm(!showUserForm)}
          className="btn btn-primary"
        >
          Add User
        </button>
      </div>

      {showUserForm && (
        <form onSubmit={handleCreateUser} className="mb-6" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="vendor">Vendor</option>
                <option value="auditor">Auditor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary">
              Create User
            </button>
            <button
              type="button"
              onClick={() => setShowUserForm(false)}
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
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`status-badge ${
                  user.role === 'admin' ? 'status-rejected' :
                  user.role === 'auditor' ? 'status-under-review' :
                  'status-approved'
                }`}>
                  {user.role}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user._id)}
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

export default UsersManagement;