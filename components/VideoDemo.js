'use client';

import { useState, useEffect } from 'react';
import styles from './VideoDemo.module.css';
import { Play, Pause, Volume2, VolumeX, Maximize, FileVideo } from 'lucide-react';

export default function VideoDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const duration = 70; // 70 seconds total (10 seconds per slide, 7 slides total)

  const slides = [
    { 
      img: '/images/hero.png', 
      title: 'Interactive Multi-Platform Systems',
      subtitle: "Welcome to Nabil's Portfolio Showcase. We design and build premium, custom-coded web platforms and integrated AI automations."
    },
    { 
      img: '/images/service_website.png', 
      title: 'High-Performance E-Commerce Web Storefronts',
      subtitle: "Our custom Next.js E-Commerce storefronts are engineered from scratch to achieve 100% SEO scores and boost user conversion rates by 42%."
    },
    { 
      img: '/images/service_chatbot.png', 
      title: 'OpenAI Chatbot Integrations & Analytical Logs',
      subtitle: "Custom AI chatbot agents are fine-tuned on your company data to automate lead captures and resolve 68% of support tickets automatically."
    },
    { 
      img: '/images/service_search.png', 
      title: 'Vector Semantic Search Engines',
      subtitle: "We build AI smart search widgets using vector databases to deliver fast, context-aware similarity matches under 45 milliseconds."
    },
    { 
      img: '/images/service_voice.png', 
      title: 'AI Voice Calling Bots (Twilio + ElevenLabs)',
      subtitle: "Our automated AI voice calling bots combine Twilio, ElevenLabs, and n8n backend integrations to process 2,000+ support calls daily 24/7."
    },
    { 
      img: '/images/service_app.png', 
      title: 'iOS & Android App Development (React Native)',
      subtitle: "We build high-fidelity cross-platform mobile apps for iOS and Android using React Native, featuring fluid native views and offline synchronization."
    },
    {
      img: '/logo.png',
      title: 'Start Your Custom Automation Project',
      subtitle: "Thank you for watching this presentation. Let's build your next system together. Contact me now for a free homepage demo!",
      isEnding: true
    }
  ];

  // 1. Walkthrough progress timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          const nextTime = prev + 1;
          if (nextTime >= duration) {
            setActiveSlide(0);
            return 0; // Loop back
          }
          
          // Switch screenshots every 10 seconds
          if (nextTime % 10 === 0) {
            setActiveSlide(Math.floor(nextTime / 10));
          }
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Helper function to synthesize energetic male voice
  const speakUtterance = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop anything playing
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Confident and energetic English male voice filter
    const maleVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      return v.lang.startsWith('en') && (
        name.includes('david') || 
        name.includes('male') || 
        name.includes('google uk english male') || 
        name.includes('google us english') ||
        name.includes('natural')
      );
    }) || voices.find(v => v.lang.startsWith('en'));

    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.pitch = 1.05; // Energetic resonance
    utterance.rate = 1.12;  // Confident pacing
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  // 2. Speech Synthesis Trigger
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const handleSpeech = () => {
        if (isPlaying && !isMuted) {
          speakUtterance(slides[activeSlide].subtitle);
        } else {
          window.speechSynthesis.cancel();
        }
      };

      handleSpeech();

      // Hook voices loaded event for Chrome/Firefox async loading
      window.speechSynthesis.onvoiceschanged = handleSpeech;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeSlide, isPlaying, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressBarClick = (e) => {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const seekTime = Math.floor(percentage * duration);
    
    setCurrentTime(seekTime);
    setActiveSlide(Math.floor(seekTime / 10));
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <section id="demo" className={styles.section}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-teal)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Product Walkthrough
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-dark)', marginTop: '8px' }}>
            See Nabil's coded systems in action
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0 auto' }}>
            Press play below to review the active screen-walkthrough recording of Nabil's bespoke full-stack applications and automated AI dashboards.
          </p>
        </div>

        {/* Video Card Container */}
        <div className={styles.playerCard}>
          {/* Header row */}
          <div className={styles.playerHeader}>
            <div className={styles.headerTitle}>
              <FileVideo size={16} /> nabil_product_demo.mp4
              <span className={styles.recordLight}></span>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>ACTIVE WALKTHROUGH</span>
            </div>
            <div className={styles.dots}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
          </div>

          {/* Screen Showcase */}
          <div className={styles.playerScreen} onClick={togglePlay}>
            {/* Play Overlay */}
            {!isPlaying && (
              <div className={styles.playOverlay}>
                <div className={styles.playButtonCircle}>
                  <Play size={36} style={{ fill: 'currentColor', marginLeft: '6px' }} />
                </div>
              </div>
            )}

            {/* Screenshots slide loop (with active vertical scroll keyframe translation & special ending slide handler) */}
            {slides.map((slide, idx) => {
              if (slide.isEnding) {
                return (
                  <div 
                    key={idx} 
                    className={`${styles.endingScreen} ${activeSlide === idx ? styles.imageActive : ''}`}
                  >
                    <img src="/logo.png" alt="Nabil Logo" className={styles.endingLogo} />
                    <h3 className={styles.endingTitle}>THANK YOU FOR WATCHING</h3>
                    <p className={styles.endingSub}>Let's build your next custom automation system or website.</p>
                    <a 
                      href="#contact" 
                      className="btn btn-primary" 
                      onClick={(e) => {
                        e.preventDefault();
                        const contactEl = document.getElementById('contact');
                        if (contactEl) {
                          contactEl.scrollIntoView({ behavior: 'smooth' });
                          setIsPlaying(false); // Pause walkthrough
                        }
                      }}
                      style={{ marginTop: '20px', padding: '12px 28px', fontSize: '0.9rem', letterSpacing: '0.5px' }}
                    >
                      Get A Free Demo Homepage
                    </a>
                  </div>
                );
              }
              return (
                <img 
                  key={idx}
                  src={slide.img} 
                  alt={slide.title} 
                  className={`${styles.screenImage} ${activeSlide === idx ? styles.imageActive : ''} ${
                    isPlaying && activeSlide === idx ? styles.imageScrolling : ''
                  }`} 
                />
              );
            })}

            {/* Subtitles Overlay Bar */}
            {isPlaying && (
              <div className={styles.subtitlesContainer}>
                <p className={styles.subtitleText}>
                  {slides[activeSlide].subtitle}
                </p>
              </div>
            )}
          </div>

          {/* Media Player Controls */}
          <div className={styles.playerControls}>
            {/* Progress track */}
            <div className={styles.progressTrack} onClick={handleProgressBarClick}>
              <div className={styles.progressBar} style={{ width: `${progressPercent}%` }}>
                <span className={styles.progressKnob}></span>
              </div>
            </div>

            {/* Action buttons bar */}
            <div className={styles.buttonsRow}>
              <div className={styles.leftControls}>
                <button className={styles.controlBtn} onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <div className={styles.timecode}>
                  <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                </div>
                <span className={styles.videoTitle}>
                  📺 {slides[activeSlide].title}
                </span>
              </div>

              <div className={styles.rightControls}>
                <button className={styles.controlBtn} onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button className={styles.controlBtn} aria-label="Full Screen">
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
