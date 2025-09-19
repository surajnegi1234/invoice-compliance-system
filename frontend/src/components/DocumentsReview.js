import React from 'react';

const DocumentsReview = ({ documents, handleStatusUpdate }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Document Review</h3>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Vendor</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document._id}>
              <td>
                <div>
                  <div style={{ fontWeight: '500' }}>{document.title}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{document.fileName}</div>
                </div>
              </td>
              <td>{document.vendor?.name}</td>
              <td style={{ textTransform: 'capitalize' }}>
                {document.category.replace('_', ' ')}
              </td>
              <td>
                <span className={`status-badge status-${document.status.replace('_', '-')}`}>
                  {document.status.replace('_', ' ')}
                </span>
              </td>
              <td>
                <div className="flex gap-4">
                  {document.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(document._id, 'approved')}
                      className="btn btn-success"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      Approve
                    </button>
                  )}
                  {document.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(document._id, 'rejected')}
                      className="btn btn-danger"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      Reject
                    </button>
                  )}
                  {document.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(document._id, 'under_review')}
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      Review
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsReview;