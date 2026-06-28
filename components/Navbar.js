'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMobileActive(false);
    
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.navContainer} container`}>
        {/* Logo block */}
        <Link href="/" className={styles.logoLink} onClick={(e) => handleNavClick(e, 'hero')}>
          <img src="/logo.png" alt="Nabil Logo" className={styles.logoImage} />
        </Link>

        {/* Links Navigation */}
        <nav>
          <ul className={`${styles.navLinks} ${mobileActive ? styles.navActive : ''}`}>
            <li>
              <a href="#about" className={styles.navLink} onClick={(e) => handleNavClick(e, 'about')}>
                About
              </a>
            </li>
            <li>
              <a href="#services" className={styles.navLink} onClick={(e) => handleNavClick(e, 'services')}>
                Services
              </a>
            </li>
            <li>
              <a href="#work" className={styles.navLink} onClick={(e) => handleNavClick(e, 'work')}>
                Work
              </a>
            </li>
            <li>
              <a href="#process" className={styles.navLink} onClick={(e) => handleNavClick(e, 'process')}>
                Process
              </a>
            </li>
            <li>
              <a 
                href="https://www.fiverr.com/nabeelahmad208?public_mode=true" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${styles.navLink} ${styles.fiverrBtn}`}
              >
                Fiverr
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`${styles.navLink} ${styles.ctaBtn}`} 
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                Free Demo
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Toggle Button */}
        <button 
          className={`${styles.mobileToggle} ${mobileActive ? styles.toggleActive : ''}`} 
          onClick={() => setMobileActive(!mobileActive)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
