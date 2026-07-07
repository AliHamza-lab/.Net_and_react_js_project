import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';
import { Shield } from 'lucide-react';

// Pages
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';

const NavigationHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      background: 'rgba(11, 15, 25, 0.7)',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '16px 20px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <Shield size={20} style={{ color: '#818cf8' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#f3f4f6', letterSpacing: '-0.5px' }}>
            RBAC<span style={{ color: '#818cf8' }}>Secure</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          {user && (
            <>
              <NavLink to="/user-dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>User Space</NavLink>
              {user.role === 'Admin' && (
                <NavLink to="/admin-dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin Panel</NavLink>
              )}
            </>
          )}

          {!user ? (
            <div style={{ display: 'flex', gap: '10px', marginLeft: '8px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Sign Up</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ fontSize: '0.8rem', color: '#f3f4f6', fontWeight: 600 }}>{user.username}</span>
                <span className={`role-badge role-badge-${user.role.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{user.role}</span>
              </div>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                Sign Out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const AppContent = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavigationHeader />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes (Authentication Required) */}
          <Route element={<ProtectedRoute />}>

            {/* User Access (User or Admin roles) */}
            <Route element={<RoleProtectedRoute allowedRoles={['User', 'Admin']} />}>
              <Route path="/user-dashboard" element={<UserDashboard />} />
            </Route>

            {/* Admin-Only Access (Admin role only) */}
            <Route element={<RoleProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280', marginTop: '40px' }}>
        RBAC Auth Secure Dashboard Core © {new Date().getFullYear()}. Fully compiled with .NET 10 & React.
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
