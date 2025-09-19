import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Login successful!');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  // Demo accounts for testing
  const demoAccounts = [
    { role: 'Admin', email: 'admin@test.com', password: 'admin123' },
    { role: 'Auditor', email: 'auditor@test.com', password: 'auditor123' },
    { role: 'Vendor', email: 'vendor@test.com', password: 'vendor123' }
  ];

  const fillCredentials = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">IC</div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Invoice & Compliance Management System</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary login-btn"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="sample-credentials">
          <h3>Demo Accounts</h3>
          {demoAccounts.map((item, index) => (
            <div key={index} className="credential-item">
              <div className="credential-info">
                <h4>{item.role}</h4>
                <p>{item.email}</p>
              </div>
              <button
                type="button"
                onClick={() => fillCredentials(item.email, item.password)}
                className="use-btn"
              >
                Use Account
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;