import React from 'react';

const DocumentsTable = ({ documents, onDelete }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">My Documents</h3>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Category</th>
            <th>Status</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(documents) && documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc._id}>
                <td>
                  <div>
                    <div style={{ fontWeight: '500' }}>{doc.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{doc.fileName}</div>
                  </div>
                </td>
                <td style={{ textTransform: 'capitalize' }}>
                  {doc.category.replace('_', ' ')}
                </td>
                <td>
                  <span className={`status-badge status-${doc.status.replace('_', '-')}`}>
                    {doc.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  {new Date(doc.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => onDelete(doc._id)}
                    className="btn btn-danger"
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  >
                    Delete
                  </button>
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

export default DocumentsTable;