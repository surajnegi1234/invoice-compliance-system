import React from 'react';

const UploadForm = ({ newDocument, setNewDocument, handleFileUpload, uploading, onCancel }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Upload New Document</h3>
      </div>
      <form onSubmit={handleFileUpload}>
        <div className="form-group">
          <label className="form-label">Document Title</label>
          <input
            type="text"
            className="form-input"
            value={newDocument.title}
            onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={newDocument.category}
            onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
          >
            <option value="invoice">Invoice</option>
            <option value="report">Report</option>
            <option value="work_order">Work Order</option>
            <option value="agreement">Agreement</option>
            <option value="certificate">Certificate</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">File</label>
          <input
            type="file"
            className="form-input"
            onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files[0] })}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            required
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="btn btn-primary"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;