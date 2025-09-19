import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../config/api';
import StatCard from '../components/StatCard';
import UploadForm from '../components/UploadForm';
import DocumentsTable from '../components/DocumentsTable';

const VendorDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [newDocument, setNewDocument] = useState({
    title: '',
    category: 'invoice',
    file: null
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/api/documents');
      if (response.data.success) {
        setDocuments(Array.isArray(response.data.documents) ? response.data.documents : []);
      } else {
        setDocuments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      toast.error('Failed to fetch documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!newDocument.file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', newDocument.file);
    formData.append('title', newDocument.title);
    formData.append('category', newDocument.category);

    try {
      const response = await api.post('/api/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success('Document uploaded successfully');
        setNewDocument({ title: '', category: 'invoice', file: null });
        setShowUploadForm(false);
        fetchDocuments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await api.delete(`/api/documents/${documentId}`);
        if (response.data.success) {
          toast.success('Document deleted');
          fetchDocuments();
        }
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Calculate stats
  const approvedDocs = Array.isArray(documents) ? documents.filter(doc => doc.status === 'approved') : [];
  const pendingDocs = Array.isArray(documents) ? documents.filter(doc => doc.status === 'pending') : [];
  const rejectedDocs = Array.isArray(documents) ? documents.filter(doc => doc.status === 'rejected') : [];

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Vendor Dashboard</h1>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn btn-primary"
        >
          Upload Document
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard title="Total Documents" value={documents.length} />
        <StatCard title="Approved" value={approvedDocs.length} type="success" />
        <StatCard title="Pending Review" value={pendingDocs.length} type="warning" />
        <StatCard title="Rejected" value={rejectedDocs.length} type="danger" />
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <UploadForm
          newDocument={newDocument}
          setNewDocument={setNewDocument}
          handleFileUpload={handleFileUpload}
          uploading={uploading}
          onCancel={() => setShowUploadForm(false)}
        />
      )}

      {/* Documents Table */}
      <DocumentsTable
        documents={documents}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
};

export default VendorDashboard;