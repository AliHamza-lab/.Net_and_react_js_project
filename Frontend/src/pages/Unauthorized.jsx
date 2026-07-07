// React import kiya taake components aur UI render kar sakein
import React from 'react';
// Link component import kiya routing navigation ke liye bina page reload kiye
import { Link } from 'react-router-dom';
// ShieldAlert, ArrowLeft, aur LogOut icons import kiye lucide-react package se
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
// AuthContext se authentication state aur functions (jaise user info, logout) use karne ke liye custom hook import kiya
import { useAuth } from '../context/AuthContext';

// Unauthorized (Access Denied) component jo non-permitted roles ke liye screen dikhayega
const Unauthorized = () => {
  // useAuth hook se logged-in user ki details aur logout trigger method extract kiya
  const { user, logout } = useAuth();

  return (
    // Outer flex wrapper page ko vertically aur horizontally center-align karne ke liye
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '20px' }}>
      {/* Box container jo glassmorphism styling aur alert red border ke sath error show karega */}
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
        
        {/* Warning Icon wrapper container */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '18px', borderRadius: '50%', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {/* Warning symbol/shield icon */}
            <ShieldAlert size={48} style={{ color: '#f87171' }} />
          </div>
        </div>

        {/* Access Denied ka main heading */}
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: '#f3f4f6' }}>403 - Access Denied</h1>
        
        {/* User context description jo message display karta hai ke user ke paas permissions nahi hain */}
        <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
          {/* Agar user logged in hai to uska username dikhao, warna 'User' label */}
          Hello {user ? <strong>{user.username}</strong> : 'User'}, you do not have permission to view this resource. The requested page is restricted and your current role 
          {/* User ka active role badge show karega */}
          <span className={`role-badge role-badge-${user?.role?.toLowerCase()}`} style={{ margin: '0 6px' }}>{user?.role || 'Guest'}</span> 
          does not possess the administrative privileges required.
        </p>

        {/* Buttons dynamic actions wrapper list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Button home screen par redirection ke liye */}
          <Link to="/" className="btn btn-primary" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <ArrowLeft size={18} />
            Back to Home Screen
          </Link>
          
          {/* Button current session ko end karke signout karne ke liye */}
          <button onClick={logout} className="btn btn-secondary" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <LogOut size={16} />
            Log Out / Switch Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
