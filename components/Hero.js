'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import { ArrowRight, CheckCircle2, Terminal } from 'lucide-react';

export default function Hero() {
  const [typedText, setTypedText] = useState('');
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const imageRef = useRef(null);

  // 1. Typewriter Animation Logic
  useEffect(() => {
    const fullText = `const dev = new AIAutomationDeveloper('Nabil');\nawait dev.build({ webApp: true, aiAgents: true });`;
    let index = 0;
    let timer;

    const type = () => {
      if (index < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(index));
        index++;
        timer = setTimeout(type, 45); // Typing speed
      } else {
        // Hold for 6 seconds and restart
        timer = setTimeout(() => {
          setTypedText('');
          index = 0;
          type();
        }, 6000);
      }
    };

    type();
    return () => clearTimeout(timer);
  }, []);

  // 2. Parallax Scrolling Effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      // Move illustration slightly slower on scroll (15% rate)
      setParallaxOffset(scrollPos * 0.15);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScrollTo = (e, id) => {
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
    <section id="hero" className={styles.heroSection}>
      <div className={styles.decorCircle1}></div>
      <div className={styles.decorCircle2}></div>

      <div className="container">
        <div className={styles.grid}>
          {/* Content Block */}
          <div className={styles.contentBlock}>
            {/* Trust Signals */}
            <div className={styles.trustBadges}>
              <span className={styles.trustBadge}>
                <CheckCircle2 size={14} /> 20+ Projects Delivered
              </span>
              <span className={styles.trustBadge}>
                <CheckCircle2 size={14} /> Free Demo Before You Pay
              </span>
            </div>

            <h1 className={styles.title}>
              Full-stack developer <br />
              &amp; <span className={styles.titleHighlight}>AI automation</span> specialist
            </h1>

            {/* Typewriter Terminal Block */}
            <div className={styles.terminal}>
              <div className={styles.terminalHeader}>
                <span className={`${styles.dot} ${styles.dotRed}`}></span>
                <span className={`${styles.dot} ${styles.dotYellow}`}></span>
                <span className={`${styles.dot} ${styles.dotGreen}`}></span>
              </div>
              <div className={styles.terminalCode}>
                <span>{typedText}</span>
                <span className={styles.cursor}></span>
              </div>
            </div>

            <p className={styles.subTitle}>
              I build high-end custom web applications and bespoke AI solutions (chatbots, voice call automation, semantic search) designed to drive conversions and automate workflows. No page templates. 100% custom-built.
            </p>

            <div className={styles.actions}>
              <a 
                href="#work" 
                className="btn btn-primary"
                onClick={(e) => smoothScrollTo(e, 'work')}
              >
                View my work <ArrowRight size={16} />
              </a>
              <a 
                href="#contact" 
                className="btn btn-gold"
                onClick={(e) => smoothScrollTo(e, 'contact')}
              >
                Get a free demo
              </a>
            </div>
          </div>

          {/* Illustration Block with Parallax scroll */}
          <div className={styles.illustrationBlock}>
            <img 
              ref={imageRef}
              src="/images/hero.png" 
              alt="AI Automation & Custom Dev Illustration" 
              className={styles.heroImage}
              style={{ transform: `translateY(${parallaxOffset}px)` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
