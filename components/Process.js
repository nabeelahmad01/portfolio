'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Process.module.css';

function ProcessStep({ step, index }) {
  const [active, setActive] = useState(false);
  const stepRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (stepRef.current) {
      observer.observe(stepRef.current);
    }

    return () => {
      if (stepRef.current) {
        observer.unobserve(stepRef.current);
      }
    };
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div 
      ref={stepRef} 
      className={`${styles.stepContainer} ${isLeft ? styles.left : styles.right} ${
        active ? styles.stepContainerActive : ''
      }`}
    >
      <div className={styles.nodePoint}></div>
      <div className={styles.cardBlock}>
        <span className={styles.stepNumber}>STAGE 0{index + 1}</span>
        <div className={styles.card}>
          <img src={step.img} alt={step.title} className={styles.stepIllustration} />
          <div className={styles.stepDetails}>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Process() {
  const steps = [
    {
      title: 'Free Demo First',
      desc: 'We map your goal, and I code a fully functional homepage or AI automation prototype within 24 hours. Zero cost. Zero risk.',
      img: '/images/process_demo.png'
    },
    {
      title: 'Build & Refine',
      desc: 'Once you approve the initial demo, I flesh out the entire codebase, configure databases, and fine-tune AI prompts for precision.',
      img: '/images/service_chatbot.png'
    },
    {
      title: 'Launch Project',
      desc: 'I deploy the application on fast serverless platforms (Vercel/Netlify), connect your domains, configure SSL, and verify analytics logs.',
      img: '/images/hero.png'
    },
    {
      title: 'Ongoing Support',
      desc: 'I provide continuous system maintenance, monitor chat logs for lead leaks, and optimize AI scripts as your business scales.',
      img: '/images/service_voice.png'
    }
  ];

  return (
    <section id="process" className={styles.processSection}>
      <div className="container">
        {/* Header Section */}
        <div className={styles.sectionHeader}>
          <span className={styles.subtitle}>Our Process</span>
          <h2 className={styles.title}>From demo to deployment in days.</h2>
          <p className={styles.desc}>
            An honest, frictionless workflow designed to deliver working software to you without long contract negotiations or deposit risks.
          </p>
        </div>

        {/* Timeline Block */}
        <div className={styles.timeline}>
          {steps.map((step, i) => (
            <ProcessStep key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
