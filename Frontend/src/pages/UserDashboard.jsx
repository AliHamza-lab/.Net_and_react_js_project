import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, ShieldAlert, LogOut, CheckCircle, Clock } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout, fetchWithAuth } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetchWithAuth('/api/pages/user-only');
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}: Access Denied.`);
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to load user-only data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>User Space</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Protected dashboard for authenticated members</p>
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ display: 'flex', gap: '8px', padding: '10px 18px', fontSize: '0.85rem' }}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* API response block */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={22} style={{ color: '#10b981' }} />
            Secure API Verification
          </h3>

          {loading ? (
            <p style={{ color: '#6b7280' }}>Verifying JWT authorization against server...</p>
          ) : error ? (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '12px', color: '#f87171' }}>
              <p><strong>Authorization Rejected:</strong></p>
              <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{error}</p>
            </div>
          ) : data ? (
            <div>
              <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '12px', marginBottom: '20px' }}>
                <p style={{ fontWeight: 600, color: '#10b981', marginBottom: '6px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} /> Token Authenticated Successfully!
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  "{data.content}"
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Name Claims</div>
                  <div style={{ fontWeight: 600, color: '#f3f4f6' }}>{data.authorizedUser}</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Role Claims</div>
                  <div>
                    <span className={`role-badge role-badge-${data.authorizedRole.toLowerCase()}`}>{data.authorizedRole}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Informative card about token parsing */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: '#818cf8' }} />
            Token Information
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Your JSON Web Token (JWT) is locally stored in the browser's <code>localStorage</code>. For subsequent requests to backend pages, the <code>AuthContext</code> automatically injects the token as an <code>Authorization: Bearer &lt;Token&gt;</code> header.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
