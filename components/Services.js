'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Services.module.css';
import { Bot, Monitor, Search, PhoneCall, Smartphone } from 'lucide-react';

export default function Services() {
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

  const services = [
    {
      icon: Bot,
      title: 'AI Chatbot Development',
      desc: 'Bespoke AI chatbot solutions trained on your unique business context and databases using OpenAI API.',
      bullets: ['Custom System Prompts', 'Lead Capture Logic', 'Integrates with Slack & Web']
    },
    {
      icon: Monitor,
      title: 'Websites & E-Commerce',
      desc: 'High-performance bespoke websites and online stores written in pure code. Zero templates, lightning speed.',
      bullets: ['Next.js / React Speed', 'Stripe Payment Pipelines', 'Full SEO Optimization']
    },
    {
      icon: Smartphone,
      title: 'iOS & Android App Dev',
      desc: 'High-fidelity cross-platform mobile apps built with React Native and Flutter, featuring offline support and smooth animations.',
      bullets: ['Native Fluid Performance', 'Offline-First Syncing', 'App Store Submissions']
    },
    {
      icon: Search,
      title: 'AI Smart Search',
      desc: 'Intelligent vector-based search systems that understand customer intent rather than just keywords.',
      bullets: ['Contextual Matching', 'Fast Semantic Indexing', 'Higher E-commerce Conversion']
    },
    {
      icon: PhoneCall,
      title: 'AI Voice Calling Bot',
      desc: 'Custom voice call automations powered by Twilio, ElevenLabs natural speech synthesis, and n8n backend.',
      bullets: ['Low-latency Responses', 'Automatic n8n CRM Logging', '24/7 Phone Support Agent']
    }
  ];

  return (
    <section 
      id="services" 
      ref={sectionRef} 
      className={`${styles.servicesSection} reveal ${isVisible ? 'reveal-active' : ''}`}
    >
      <div className="container">
        {/* Header Block */}
        <div className={styles.sectionHeader}>
          <span className={styles.subtitle}>Services</span>
          <h2 className={styles.title}>Bespoke developer solutions built for scale.</h2>
          <p className={styles.desc}>
            I code custom integrations and high-end interfaces that help modern companies automate manual interactions and win customers.
          </p>
        </div>

        {/* Services Grid */}
        <div className={styles.grid}>
          {services.map((service, i) => (
            <div 
              key={i} 
              className={`${styles.card} delay-${i + 1}`}
            >
              <div className={styles.iconWrapper}>
                <service.icon className={styles.icon} size={32} strokeWidth={1.5} />
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardText}>{service.desc}</p>
              
              <ul className={styles.bulletList}>
                {service.bullets.map((bullet, idx) => (
                  <li key={idx} className={styles.bullet}>
                    <span className={styles.bulletDot}></span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
