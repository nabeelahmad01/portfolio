'use client';

import styles from './Footer.module.css';

export default function Footer() {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandBlock}>
            <div className={styles.logoBlock}>
              <img src="/logo.png" alt="Nabil Logo" className={styles.logoImage} />
            </div>
            <p className={styles.tagline}>
              Full-stack developer and AI automation engineer. Custom-coded high-performing applications built for modern conversion results.
            </p>
          </div>

          {/* Links Column */}
          <div className={styles.linksBlock}>
            <div className={styles.linkGroup}>
              <span className={styles.groupTitle}>Sitemap</span>
              <ul className={styles.linksList}>
                <li>
                  <a href="#about" className={styles.link} onClick={(e) => handleScrollTo(e, 'about')}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" className={styles.link} onClick={(e) => handleScrollTo(e, 'services')}>
                    Services
                  </a>
                </li>
                <li>
                  <a href="#work" className={styles.link} onClick={(e) => handleScrollTo(e, 'work')}>
                    Selected Work
                  </a>
                </li>
                <li>
                  <a href="#process" className={styles.link} onClick={(e) => handleScrollTo(e, 'process')}>
                    Process
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              {/* Sitemap links block */}
            </div>
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className={styles.bottomBar}>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} Nabil Ahmad. All rights reserved. 100% custom coded.
          </span>
          <div className={styles.socials}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              LinkedIn
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
