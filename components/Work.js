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
      name: 'AI Chatbot Integration Demo',
      desc: 'This demo shows how a custom AI chatbot can be trained on a business\'s own data to answer customer questions and capture leads automatically.',
      metricLabel: 'What This Demonstrates',
      metricValue: 'Automated lead capture + instant contextual responses',
      tags: ['OpenAI API', 'React', 'Node.js', 'MongoDB', 'Stripe'],
      img: '/images/service_chatbot.png'
    },
    {
      name: 'E-Commerce Storefront Demo',
      desc: 'This demo shows a custom e-commerce storefront with a fully optimized stripe-powered checkout pipeline built for performance and speed.',
      metricLabel: 'What This Demonstrates',
      metricValue: 'Bespoke checkout lanes + conversion optimized load speeds',
      tags: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Stripe'],
      img: '/images/service_website.png'
    },
    {
      name: 'Smart Search Demo',
      desc: 'This demo shows how an AI smart search widget processes natural language queries using vector embeddings to display context-aware matches instantly.',
      metricLabel: 'What This Demonstrates',
      metricValue: 'Semantic search listings + sub-50ms vector query matching',
      tags: ['OpenAI API', 'Next.js', 'Node.js', 'PostgreSQL'],
      img: '/images/service_search.png'
    },
    {
      name: 'AI Voice Calling Demo',
      desc: 'This demo shows a neural telephony agent built with Twilio and ElevenLabs voice lines, connected to webhooks to automate customer call routing.',
      metricLabel: 'What This Demonstrates',
      metricValue: 'Neural voice responses + automatic CRM routing pipelines',
      tags: ['Twilio', 'ElevenLabs', 'n8n', 'Node.js'],
      img: '/images/service_voice.png'
    },
    {
      name: 'Mobile App Demo',
      desc: 'This demo shows a cross-platform mobile application interface featuring fluid native animations, offline tracking, and server database synchronization.',
      metricLabel: 'What This Demonstrates',
      metricValue: 'React Native framework + offline-first database sync',
      tags: ['React Native', 'Node.js', 'PostgreSQL', 'OpenAI API'],
      img: '/images/service_app.png'
    },
    {
      name: 'Custom Subscription Dashboard Demo',
      desc: 'This demo shows a SaaS admin interface built with Next.js, displaying analytical stats, traffic numbers, and active stripe customer billing profiles.',
      metricLabel: 'What This Demonstrates',
      metricValue: 'Bespoke database administration + stripe billing control logs',
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
          <span className={styles.subtitle}>Capability Demos</span>
          <h2 className={styles.title}>Production systems built for performance.</h2>
          <p className={styles.desc}>
            A sample of visual prototype systems showing how clean code and AI integrations drive business operations.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '16px', fontStyle: 'italic', opacity: 0.85 }}>
            * These are capability demos showcasing what I can build — available for you to review live before you commit to a project.
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
