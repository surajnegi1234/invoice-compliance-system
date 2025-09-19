import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../config/api';
import StatCard from '../components/StatCard';
import UsersManagement from '../components/UsersManagement';
import AssignmentsManagement from '../components/AssignmentsManagement';
import DocumentsManagement from '../components/DocumentsManagement';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'vendor'
  });

  const [newAssignment, setNewAssignment] = useState({
    auditorId: '',
    vendorId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, assignmentsRes, documentsRes] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/assignments'),
        api.get('/api/documents')
      ]);
      
      setUsers(usersRes.data);
      setAssignments(assignmentsRes.data);
      // Handle different response formats for documents
      const documentsData = documentsRes.data.success ? documentsRes.data.documents : documentsRes.data;
      setDocuments(Array.isArray(documentsData) ? documentsData : []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users', newUser);
      toast.success('User created successfully');
      setNewUser({ name: '', email: '', password: '', role: 'vendor' });
      setShowUserForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/assignments', {
        auditor_id: newAssignment.auditorId,
        vendor_id: newAssignment.vendorId
      });
      toast.success('Assignment created successfully');
      setNewAssignment({ auditorId: '', vendorId: '' });
      setShowAssignmentForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${userId}`);
        toast.success('User deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await api.delete(`/api/assignments/${assignmentId}`);
        toast.success('Assignment deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete assignment');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const auditors = users.filter(user => user.role === 'auditor');
  const vendors = users.filter(user => user.role === 'vendor');

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard title="Total Users" value={users.length} />
        <StatCard title="Total Documents" value={documents.length} />
        <StatCard title="Assignments" value={assignments.length} />
        <StatCard title="Active Vendors" value={vendors.length} type="success" />
      </div>

      <UsersManagement 
        users={users}
        showUserForm={showUserForm}
        setShowUserForm={setShowUserForm}
        newUser={newUser}
        setNewUser={setNewUser}
        handleCreateUser={handleCreateUser}
        handleDeleteUser={handleDeleteUser}
      />

      <AssignmentsManagement 
        assignments={assignments}
        showAssignmentForm={showAssignmentForm}
        setShowAssignmentForm={setShowAssignmentForm}
        newAssignment={newAssignment}
        setNewAssignment={setNewAssignment}
        handleCreateAssignment={handleCreateAssignment}
        handleDeleteAssignment={handleDeleteAssignment}
        auditors={auditors}
        vendors={vendors}
      />

      <DocumentsManagement documents={documents} />
    </div>
  );
};

export default AdminDashboard;