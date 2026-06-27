'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Work.module.css';

export default function Work() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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

  const projects = [
    {
      name: 'OmniChat AI Agent',
      desc: 'Bespoke customer support chatbot integrated directly into an e-commerce platform, enabling context-aware product queries and checkout help.',
      metricLabel: 'Key Result',
      metricValue: '68% reduction in customer support tickets',
      tags: ['OpenAI API', 'React', 'Node.js', 'MongoDB', 'Stripe'],
      img: '/images/service_chatbot.png'
    },
    {
      name: 'LaunchFlow SaaS Portal',
      desc: 'Bespoke web dashboard and conversion-optimized checkout pipeline built from scratch with custom serverless handlers.',
      metricLabel: 'Key Result',
      metricValue: '+42% user conversion rate increase',
      tags: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Stripe'],
      img: '/images/service_website.png'
    },
    {
      name: 'LexiSearch Directory',
      desc: 'Contextual AI smart search widget that processes natural language intent using embeddings, showing instant suggestions to visitors.',
      metricLabel: 'Key Result',
      metricValue: 'Latency reduced to under 45ms average',
      tags: ['OpenAI API', 'Next.js', 'Node.js', 'PostgreSQL'],
      img: '/images/service_search.png'
    },
    {
      name: 'CallAgent Voice Butler',
      desc: 'A voice calling system linked to ElevenLabs neural speech synthesizers, Twilio, and automated n8n workflows to schedule demo calls.',
      metricLabel: 'Key Result',
      metricValue: 'Resolves 2,000+ support calls daily 24/7',
      tags: ['Twilio', 'ElevenLabs', 'n8n', 'Node.js'],
      img: '/images/service_voice.png'
    },
    {
      name: 'FitSync Mobile App',
      desc: 'Premium iOS and Android fitness platform featuring real-time offline tracking data synching and chat integrations.',
      metricLabel: 'Key Result',
      metricValue: '50,000+ App Store downloads in 60 days',
      tags: ['React Native', 'Node.js', 'PostgreSQL', 'OpenAI API'],
      img: '/images/service_app.png'
    },
    {
      name: 'Apex E-Store Storefront',
      desc: 'High-speed custom Next.js storefront featuring localized checkout lanes, stripe subscriptions, and admin portals.',
      metricLabel: 'Key Result',
      metricValue: '+180% speed upgrade & +24% order average',
      tags: ['Next.js', 'React', 'MongoDB', 'Stripe'],
      img: '/images/service_website.png'
    }
  ];

  return (
    <section 
      id="work" 
      ref={sectionRef} 
      className={`${styles.workSection} reveal ${isVisible ? 'reveal-active' : ''}`}
    >
      <div className="container">
        {/* Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.subtitle}>Selected Work</span>
          <h2 className={styles.title}>Production systems built for performance.</h2>
          <p className={styles.desc}>
            A sample of active client integrations showing how clean code and AI automations drive real business numbers.
          </p>
        </div>

        {/* Project Grid */}
        <div className={styles.grid}>
          {projects.map((project, i) => (
            <div 
              key={i} 
              className={`${styles.card} delay-${i % 2 === 0 ? 1 : 2}`}
            >
              {/* Graphic background */}
              <div className={styles.cardImageWrapper}>
                <img 
                  src={project.img} 
                  alt={`${project.name} graphic`} 
                  className={styles.cardImage} 
                />
              </div>

              {/* Core description details */}
              <div className={styles.cardContent}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <p className={styles.projectDesc}>{project.desc}</p>

                {/* Metric section */}
                <div className={styles.metricBlock}>
                  <div className={styles.metricLabel}>{project.metricLabel}</div>
                  <div className={styles.metricValue}>{project.metricValue}</div>
                </div>

                {/* Tech tags */}
                <div className={styles.tagsBlock}>
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
