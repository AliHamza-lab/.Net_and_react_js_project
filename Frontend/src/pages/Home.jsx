import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Info, UserCheck, Key, ArrowRight, ExternalLink } from 'lucide-react';

const Home = () => {
  const { user, fetchWithAuth } = useAuth();
  const [publicData, setPublicData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPublicData = async () => {
      try {
        const res = await fetchWithAuth('/api/pages/public');
        if (res.ok) {
          const data = await res.json();
          setPublicData(data);
        }
      } catch (err) {
        console.error('Failed to load public data', err);
      } finally {
        setLoading(false);
      }
    };
    getPublicData();
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Hero Banner */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
          Role-Based Access Control <br />
          <span className="text-gradient">JWT Authentication Demo</span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          A secure implementation using a **.NET Core 10 Web API** backend and a **Vite + React** single-page application.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
        
        {/* Connection status card */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            <Key size={24} style={{ color: '#818cf8' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Session Status</h3>
          </div>
          
          {user ? (
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <UserCheck size={18} style={{ color: '#10b981' }} />
                <span>Logged in as: <strong>{user.username}</strong></span>
              </div>
              <div style={{ marginBottom: '24px' }}>
                Role: <span className={`role-badge role-badge-${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Link to={user.role === 'Admin' ? '/admin-dashboard' : '/user-dashboard'} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  Go to Dashboard <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '0.95rem' }}>
                You are viewing as a guest. Authenticate to test protected dashboards and endpoint authorization.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/login" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Public API Endpoint Data card */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            <ExternalLink size={24} style={{ color: '#06b6d4' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Public API Request</h3>
          </div>
          
          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Fetching api/pages/public...</p>
          ) : publicData ? (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                Endpoint: GET /api/pages/public
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', color: '#f3f4f6' }}>{publicData.title}</h4>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5, background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                "{publicData.content}"
              </p>
            </div>
          ) : (
            <p style={{ color: '#ef4444', fontSize: '0.95rem' }}>
              Error: Could not connect to the Backend API. Verify that the .NET project is compiled and running at http://localhost:5131.
            </p>
          )}
        </div>
      </div>

      {/* RBAC Route Matrix section */}
      <div className="glass-card" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
          <ShieldCheck size={28} style={{ color: '#818cf8' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Role-Based Route Guard Matrix</h2>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 600 }}>Frontend Path</th>
              <th style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 600 }}>Backend Endpoint</th>
              <th style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 600 }}>Required Role</th>
              <th style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 600 }}>Guest User</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '16px', fontWeight: 600 }}>`/` (Home)</td>
              <td style={{ padding: '16px', fontFamily: 'monospace', color: '#06b6d4' }}>/api/pages/public</td>
              <td style={{ padding: '16px' }}><span className="role-badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#9ca3af' }}>Public</span></td>
              <td style={{ padding: '16px', color: '#10b981', fontWeight: 600 }}>Allowed</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '16px', fontWeight: 600 }}>`/user-dashboard`</td>
              <td style={{ padding: '16px', fontFamily: 'monospace', color: '#818cf8' }}>/api/pages/user-only</td>
              <td style={{ padding: '16px', display: 'flex', gap: '6px' }}>
                <span className="role-badge role-badge-user">User</span>
                <span className="role-badge role-badge-admin">Admin</span>
              </td>
              <td style={{ padding: '16px', color: '#ef4444', fontWeight: 600 }}>Redirects to Login</td>
            </tr>
            <tr>
              <td style={{ padding: '16px', fontWeight: 600 }}>`/admin-dashboard`</td>
              <td style={{ padding: '16px', fontFamily: 'monospace', color: '#f472b6' }}>/api/pages/admin-only</td>
              <td style={{ padding: '16px' }}><span className="role-badge role-badge-admin">Admin Only</span></td>
              <td style={{ padding: '16px', color: '#ef4444', fontWeight: 600 }}>Redirects to Login</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
