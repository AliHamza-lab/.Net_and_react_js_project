import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, Terminal, Users, AlertCircle, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout, fetchWithAuth } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock server information for demonstration
  const [mockUsers] = useState([
    { id: 1, name: 'Alice', role: 'User', status: 'Active' },
    { id: 2, name: 'Bob', role: 'Admin', status: 'Active' },
    { id: 3, name: 'Charlie', role: 'User', status: 'Suspended' }
  ]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchWithAuth('/api/pages/admin-only');
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Forbidden: You do not possess the Admin role claims required.');
        }
        throw new Error(`HTTP Error ${res.status}: Access Denied.`);
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin-only data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="text-gradient-purple">Admin Control Panel</span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Strictly restricted space for administrative tasks</p>
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ display: 'flex', gap: '8px', padding: '10px 18px', fontSize: '0.85rem' }}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        
        {/* Server Response Panel */}
        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid #f472b6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} style={{ color: '#f472b6' }} />
              Server-Side Admin Authentication
            </h3>
            <button onClick={fetchAdminData} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px' }}>
              <RefreshCw size={12} /> Reload
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#6b7280' }}>Querying secure /api/pages/admin-only endpoint...</p>
          ) : error ? (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '12px', color: '#f87171', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <AlertCircle size={20} />
              <div>
                <strong>Authentication Refused:</strong> {error}
              </div>
            </div>
          ) : data ? (
            <div>
              <div style={{ padding: '16px', background: 'rgba(244, 114, 182, 0.05)', border: '1px solid rgba(244, 114, 182, 0.15)', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#f472b6', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Backend Payload
                </div>
                <p style={{ color: '#f3f4f6', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{data.title}</p>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  "{data.content}"
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.85rem' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Logged Administrator</span>
                  <strong>{data.authorizedUser}</strong>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Access Claim Type</span>
                  <span className="role-badge role-badge-admin">{data.authorizedRole}</span>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Server Verification Time</span>
                  <span>{new Date(data.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* User Management Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
          
          {/* User List Panel */}
          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: '#c084fc' }} />
              Active Users Database (Mock)
            </h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 0', color: '#9ca3af' }}>ID</th>
                  <th style={{ padding: '10px 0', color: '#9ca3af' }}>Name</th>
                  <th style={{ padding: '10px 0', color: '#9ca3af' }}>Role</th>
                  <th style={{ padding: '10px 0', color: '#9ca3af' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 'bold' }}>#{u.id}</td>
                    <td style={{ padding: '12px 0' }}>{u.name}</td>
                    <td style={{ padding: '12px 0' }}>
                      <span className={`role-badge role-badge-${u.role.toLowerCase()}`}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{ color: u.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 600 }}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit Logs terminal */}
          <div className="glass-card" style={{ padding: '30px', background: '#090d16' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa' }}>
              <Terminal size={20} />
              System Log Term
            </h3>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#34d399', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '180px' }}>
              <div>[SYSTEM INFO] Booted WebAPI on port 5131.</div>
              <div>[SYSTEM INFO] Loaded 1 configuration policies.</div>
              <div>[AUTH VERIFY] JWT Secret Key loaded (HMAC-SHA256).</div>
              <div>[AUTH VERIFY] Issuer claim matched http://localhost:5131</div>
              <div>[API GET] /api/pages/admin-only requested by claim name: "{user?.username}"</div>
              <div>[AUTH OK] Authorization success: user mapped to Admin role.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
