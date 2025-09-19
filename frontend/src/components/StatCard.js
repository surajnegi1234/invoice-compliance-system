import React from 'react';

const StatCard = ({ title, value, type = 'default' }) => {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
      </div>
      <p className="stat-value">{value || 0}</p>
    </div>
  );
};

export default StatCard;