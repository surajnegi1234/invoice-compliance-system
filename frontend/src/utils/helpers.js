
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    pending: '#ffc107',
    approved: '#28a745', 
    rejected: '#dc3545',
    under_review: '#17a2b8'
  };
  return colors[status] || '#6c757d';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};