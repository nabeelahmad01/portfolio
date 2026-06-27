'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login request error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.viewport}>
      <div className={styles.loginCard}>
        {/* Brand layout */}
        <div className={styles.brand}>
          <img src="/logo.png" alt="Logo" className={styles.logoImage} />
          <div>
            <h2 className={styles.title}>Nabil Console</h2>
            <p className={styles.subtitle}>Enter administrator access password</p>
          </div>
        </div>

        {/* Error prompt */}
        {error && <div className={styles.errorBox}>{error}</div>}

        {/* Input credentials */}
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Access Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                style={{ width: '100%', paddingLeft: '40px' }}
                required
                disabled={loading}
              />
              <Lock 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)' 
                }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary styles.submitBtn" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
