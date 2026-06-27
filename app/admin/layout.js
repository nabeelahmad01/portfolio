'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './AdminLayout.module.css';
import { LogOut, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'DELETE'
      });
      if (res.ok) {
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // If the user is on the login page, do not render the dashboard header
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className={styles.adminContainer}>{children}</div>;
  }

  return (
    <div className={styles.adminContainer}>
      {/* Admin header nav */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoBlock}>
            <img src="/logo.png" alt="Logo" className={styles.logoImage} />
            <span className={styles.logoText}>nabil</span>
            <span className={styles.badge}>CONSOLE</span>
          </div>

          <div className={styles.navBlock}>
            <Link href="/" className={styles.publicLink} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> View Website
            </Link>
            <button className={styles.logoutBtn} onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
