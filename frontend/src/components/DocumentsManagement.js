import React from 'react';

const DocumentsManagement = ({ documents }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">All Documents</h3>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Vendor</th>
            <th>Category</th>
            <th>Status</th>
            <th>Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((document) => (
              <tr key={document._id}>
                <td>
                  <div>
                    <div style={{ fontWeight: '500' }}>{document.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{document.fileName}</div>
                  </div>
                </td>
                <td>{document.vendor?.name || 'Unknown'}</td>
                <td style={{ textTransform: 'capitalize' }}>
                  {document.category?.replace('_', ' ') || 'N/A'}
                </td>
                <td>
                  <span className={`status-badge status-${document.status?.replace('_', '-') || 'pending'}`}>
                    {document.status?.replace('_', ' ') || 'pending'}
                  </span>
                </td>
                <td>
                  {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No documents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsManagement;