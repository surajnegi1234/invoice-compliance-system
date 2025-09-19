import React from 'react';

const ReminderModal = ({ 
  showReminderModal, 
  selectedVendor, 
  reminderData, 
  setReminderData, 
  handleSendReminder, 
  setShowReminderModal 
}) => {
  if (!showReminderModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '500px', maxWidth: '90vw', margin: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Send Reminder to {selectedVendor?.name}</h3>
        </div>
        <form onSubmit={handleSendReminder}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-input"
              value={reminderData.subject}
              onChange={(e) => setReminderData({ ...reminderData, subject: e.target.value })}
              placeholder="Document Submission Reminder"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-textarea"
              value={reminderData.message}
              onChange={(e) => setReminderData({ ...reminderData, message: e.target.value })}
              placeholder="Please submit your pending documents..."
              required
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary">
              Send Reminder
            </button>
            <button
              type="button"
              onClick={() => setShowReminderModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;