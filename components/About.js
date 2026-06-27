'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './About.module.css';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  const animatedRef = useRef(false);

  const stats = [
    { target: 20, suffix: '+', label: 'Projects Delivered', desc: 'Successfully built & launched' },
    { target: 4, suffix: '', label: 'Core Services', desc: 'AI agent & full-stack expertise' },
    { target: 100, suffix: '%', label: 'Custom-Built', desc: 'No templates, pure performance' },
    { target: 24, suffix: 'h', label: 'Demo Turnaround', desc: 'Working prototype first' },
  ];

  // 1. Intersection Observer for Scroll Reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Trigger count-up animation once
          if (!animatedRef.current) {
            animatedRef.current = true;
            animateNumbers();
          }
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // 2. Count-Up Animation
  const animateNumbers = () => {
    const duration = 1500; // 1.5 seconds animation duration
    const frameRate = 1000 / 60; // 60 frames per second
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      
      const progress = frame / totalFrames;
      // Ease-out-quad function for smooth slowing down
      const easeProgress = progress * (2 - progress);

      setCounts(
        stats.map(stat => Math.min(Math.floor(easeProgress * stat.target), stat.target))
      );

      if (frame >= totalFrames) {
        clearInterval(timer);
        // Force set final target values to avoid rounding misses
        setCounts(stats.map(stat => stat.target));
      }
    }, frameRate);
  };

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className={`${styles.aboutSection} reveal ${isVisible ? 'reveal-active' : ''}`}
    >
      <div className="container">
        <div className={styles.grid}>
          {/* Bio text block */}
          <div className={styles.bioBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.subtitle}>About Me</span>
              <h2 className={styles.title}>High-performance dev with an automation edge.</h2>
            </div>
            <p className={styles.text}>
              I’m Nabil, a full-stack engineer and AI automation specialist who designs premium, fast-loading digital products. I help businesses bridge the gap between custom user interfaces and powerful backends integrated with AI systems. 
            </p>
            <p className={styles.text}>
              I believe that premium websites are not built with generic page-builders that output bloated code. Instead, I write clean, hand-coded applications from scratch, and connect them with AI voice bots, custom ChatGPT assistants, and smart search integrations that optimize business workflows.
            </p>
          </div>

          {/* Stats count up block */}
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statNumber}>
                  {counts[i]}
                  {stat.suffix}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statDesc}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
