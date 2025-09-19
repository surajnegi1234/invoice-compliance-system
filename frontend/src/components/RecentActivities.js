import React from 'react';

const RecentActivities = ({ activities }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Activities</h3>
      </div>
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {activities.slice(0, 10).map((activity) => (
          <div key={activity._id} style={{ 
            padding: '12px', 
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: '500', fontSize: '14px' }}>
                {activity.user?.name} - {activity.description}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {new Date(activity.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;