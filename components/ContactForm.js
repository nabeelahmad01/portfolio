'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ContactForm.module.css';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    service: 'AI Chatbot Development',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          business: '',
          service: 'AI Chatbot Development',
          message: ''
        });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setStatus('error');
    }
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className={`${styles.contactSection} reveal ${isVisible ? 'reveal-active' : ''}`}
    >
      <div className="container">
        <div className={styles.grid}>
          {/* Information & Contacts details block */}
          <div className={styles.infoBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.subtitle}>Get in Touch</span>
              <h2 className={styles.title}>Let’s build a free working demo.</h2>
              <p className={styles.desc}>
                Have a project idea? Describe it, select your desired automation service, and I’ll code a custom functional mock preview for your business in 24 hours.
              </p>
            </div>

            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <a href="mailto:nabildev.wepapp@gmail.com" className={styles.detailLink} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'inherit' }}>
                  <div className={styles.iconWrapper}>
                    <Mail size={18} />
                  </div>
                  <div className={styles.detailTextBlock}>
                    <span className={styles.detailLabel}>Direct Mail</span>
                    <span className={styles.detailValue}>nabildev.wepapp@gmail.com</span>
                  </div>
                </a>
              </div>

              <div className={styles.detailItem}>
                <a href="https://wa.me/923187371071" target="_blank" rel="noopener noreferrer" className={styles.detailLink} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'inherit' }}>
                  <div className={styles.iconWrapper}>
                    <Phone size={18} />
                  </div>
                  <div className={styles.detailTextBlock}>
                    <span className={styles.detailLabel}>WhatsApp</span>
                    <span className={styles.detailValue} style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>+92 318 7371071</span>
                  </div>
                </a>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.iconWrapper}>
                  <Phone size={18} style={{ opacity: 0 }} />
                  <Mail size={18} style={{ display: 'none' }} />
                </div>
                <div className={styles.detailTextBlock}>
                  <span className={styles.detailLabel}>Demo Response</span>
                  <span className={styles.detailValue}>Guaranteed under 24 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Inquiry Card */}
          <div className={styles.formCard}>
            {status === 'success' ? (
              <div className={styles.successOverlay}>
                <div className={styles.successIconWrapper}>
                  <CheckCircle size={36} />
                </div>
                <h3 className={styles.successTitle}>Inquiry Sent!</h3>
                <p className={styles.successText}>
                  Your project specifications are logged. I am assembling your free working demo and will be in touch via email shortly.
                </p>
              </div>
            ) : (
              <>
                <h3 className={styles.formTitle}>Request Your Free Demo</h3>
                <form onSubmit={handleSubmit}>
                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name" className={styles.label}>Your Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        required
                        disabled={status === 'loading'}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.label}>Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com" 
                        required
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label htmlFor="business" className={styles.label}>Business Name</label>
                      <input 
                        type="text" 
                        id="business" 
                        name="business" 
                        value={formData.business}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        disabled={status === 'loading'}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="service" className={styles.label}>Service Needed</label>
                      <select 
                        id="service" 
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        disabled={status === 'loading'}
                      >
                        <option value="AI Chatbot Development">AI Chatbot Development</option>
                        <option value="Business Website & E-commerce">Business Website &amp; E-commerce</option>
                        <option value="AI Smart Search">AI Smart Search</option>
                        <option value="AI Voice Calling Bot">AI Voice Calling Bot</option>
                        <option value="General automation help">General automation help</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Brief Project Scope</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="4" 
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe what you want to build or automate. Include any specific API preferences or integrations."
                      required
                      disabled={status === 'loading'}
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <p style={{ color: '#d9534f', fontSize: '0.85rem', marginBottom: '15px' }}>
                      Something went wrong. Please check your network and try again.
                    </p>
                  )}

                  <button 
                    type="submit" 
                    className={`btn btn-primary ${styles.submitBtn}`}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Submitting Details...' : 'Request 24h Demo'} <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
