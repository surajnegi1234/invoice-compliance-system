import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import {AuthProvider, useAuth} from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AuditorDashboard from './pages/AuditorDashboard';
import VendorDashboard from './pages/VendorDashboard';
import Layout from './components/Layout';


const ProtectedRoute = ({children, allowedRoles}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Route to appropriate dashboard
  switch(user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'auditor':
      return <AuditorDashboard />;
    case 'vendor':
      return <VendorDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardRouter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardRouter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/unauthorized"
              element={
                <div className="flex-center" style={{ minHeight: '100vh' }}>
                  <div className="text-center">
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                      Unauthorized Access
                    </h1>
                    <p style={{ marginTop: '10px', color: '#666' }}>
                      You don't have permission to access this page.
                    </p>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;