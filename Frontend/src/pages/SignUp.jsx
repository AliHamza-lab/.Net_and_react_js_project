import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, Shield, ArrowRight, AlertTriangle } from 'lucide-react';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await signup(username, password, role);
    setLoading(false);

    if (result.success) {
      navigate(role === 'Admin' ? '/admin-dashboard' : '/user-dashboard');
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '20px' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '16px' }}>
            <UserPlus size={32} className="text-gradient" style={{ color: '#818cf8' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Join us and experience secure RBAC control</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px', color: '#f87171', fontSize: '0.9rem' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', color: '#6b7280' }} />
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingLeft: '48px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', color: '#6b7280' }} />
              <input
                id="password"
                type="password"
                placeholder="Enter password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '48px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Assign Role</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Shield size={18} style={{ position: 'absolute', left: '16px', color: '#6b7280' }} />
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={{ paddingLeft: '48px', width: '100%', appearance: 'none', background: 'rgba(255, 255, 255, 0.04)' }}
              >
                <option value="User" style={{ background: '#111827' }}>Standard User</option>
                <option value="Admin" style={{ background: '#111827' }}>Administrator</option>
              </select>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
              Select "Administrator" to test admin-only page routing.
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? 'Registering...' : 'Sign Up'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#9ca3af' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
