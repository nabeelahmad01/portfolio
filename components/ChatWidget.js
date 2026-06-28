'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ChatWidget.module.css';
import { MessageSquare, X, Send, User } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormData, setLeadFormData] = useState({ name: '', email: '', need: '' });
  const [conversationId, setConversationId] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize chatbot session
  useEffect(() => {
    // 1. Fetch or generate unique conversation ID
    let convId = sessionStorage.getItem('nabil_chat_conversation_id');
    if (!convId) {
      convId = 'c_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem('nabil_chat_conversation_id', convId);
    }
    setConversationId(convId);

    // 2. Set default welcome message
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: "Hi! I am Nabil's AI Assistant. 👋\n\nI can explain Nabil's core development services, discuss pricing (starting at $100), explain the 24h free-demo turnaround process, or capture your contact details to schedule a call. What are you looking to automate?",
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, showLeadForm]);

  const handleSendMessage = async (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputValue;
    if (!textToSend.trim()) return;

    if (!customText) setInputValue('');
    setLoading(true);

    // 1. Add visitor message to state
    const visitorMsg = {
      id: Date.now(),
      sender: 'visitor',
      text: textToSend,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, visitorMsg]);

    // Check if the user is asking for a demo to prompt the inline lead form
    const lowerText = textToSend.toLowerCase();
    const isRequestingDemo = lowerText.includes('demo') || lowerText.includes('contact') || lowerText.includes('hire') || lowerText.includes('quote');

    try {
      const sessionId = sessionStorage.getItem('nabil_session_id') || '';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId,
          sessionId,
          message: textToSend
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: data.reply,
          createdAt: new Date().toISOString()
        }]);

        if (isRequestingDemo) {
          setShowLeadForm(true);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadFormChange = (e) => {
    const { name, value } = e.target;
    setLeadFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLeadFormSubmit = async (e) => {
    e.preventDefault();
    if (!leadFormData.name || !leadFormData.email) return;

    setLoading(true);
    setShowLeadForm(false);

    try {
      const sessionId = sessionStorage.getItem('nabil_session_id') || '';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId,
          sessionId,
          leadData: leadFormData
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          id: Date.now() + 2,
          sender: 'bot',
          text: data.reply,
          createdAt: new Date().toISOString()
        }]);
        setLeadFormData({ name: '', email: '', need: '' });
      }
    } catch (err) {
      console.error('Lead form chat submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Widget Bubble */}
      <button 
        className={styles.floatingBubble} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Chatbot"
      >
        {!isOpen && <span className={styles.bubbleBadge}></span>}
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      {/* Slide-Up Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.chatWindowActive : ''}`}>
        {/* Header bar */}
        <div className={styles.chatHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.avatar}>N</div>
            <div className={styles.nameBlock}>
              <span className={styles.headerTitle}>Nabil's Assistant</span>
              <span className={styles.headerStatus}>
                <span className={styles.statusDot}></span> Online (Automated)
              </span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Conversation log body */}
        <div className={styles.chatBody}>
          {messages.map((msg) => {
            const isReceipt = msg.sender === 'bot' && msg.text.startsWith('[RECEIPT]');

            if (isReceipt) {
              const lines = msg.text.replace('[RECEIPT]', '').trim().split('\n');
              const params = {};
              lines.forEach(l => {
                const index = l.indexOf(':');
                if (index !== -1) {
                  const key = l.substring(0, index).trim();
                  const val = l.substring(index + 1).trim();
                  params[key] = val;
                }
              });

              return (
                <div key={msg.id} className={`${styles.message} ${styles.botMessage}`} style={{ width: '100%' }}>
                  <div className={styles.receiptCard}>
                    <div className={styles.receiptHeader}>
                      <span className={styles.receiptTitle}>📋 DEMO ORDER RESERVED</span>
                      <span className={styles.receiptRef}>{params.Reference || '#DEMO-ORDER'}</span>
                    </div>
                    <div className={styles.receiptList}>
                      <div className={styles.receiptRow}>
                        <span className={styles.receiptLabel}>Client:</span>
                        <span className={styles.receiptVal}>{params.Name}</span>
                      </div>
                      <div className={styles.receiptRow}>
                        <span className={styles.receiptLabel}>Email:</span>
                        <span className={styles.receiptVal}>{params.Email}</span>
                      </div>
                      <div className={styles.receiptRow}>
                        <span className={styles.receiptLabel}>Service:</span>
                        <span className={styles.receiptVal}>{params.Service}</span>
                      </div>
                      <div className={styles.receiptRow}>
                        <span className={styles.receiptLabel}>Status:</span>
                        <span className={styles.receiptVal} style={{ color: 'var(--primary-teal)', fontWeight: 700 }}>{params.Status}</span>
                      </div>
                    </div>
                    <div className={styles.receiptFooter}>
                      Nabil is starting your prototype. We will email you a preview link within 24 hours.
                    </div>
                  </div>
                  <span className={styles.timestamp}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            }

            return (
              <div 
                key={msg.id} 
                className={`${styles.message} ${msg.sender === 'bot' ? styles.botMessage : styles.visitorMessage}`}
              >
                <div className={styles.bubble}>{msg.text}</div>
                <span className={styles.timestamp}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}

          {/* Contextual Inline Lead Capture Form */}
          {showLeadForm && (
            <div className={styles.inlineLeadCard}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-teal)' }}>
                Requesting a Demo? Leave Details:
              </h4>
              <form onSubmit={handleLeadFormSubmit}>
                <div className={styles.inlineFormGroup}>
                  <label htmlFor="chat-name" className={styles.inlineLabel}>Your Name</label>
                  <input 
                    type="text" 
                    id="chat-name"
                    name="name" 
                    value={leadFormData.name}
                    onChange={handleLeadFormChange}
                    className={styles.inlineInput} 
                    required 
                    placeholder="John Doe"
                  />
                </div>
                <div className={styles.inlineFormGroup} style={{ marginTop: '8px' }}>
                  <label htmlFor="chat-email" className={styles.inlineLabel}>Email Address</label>
                  <input 
                    type="email" 
                    id="chat-email"
                    name="email" 
                    value={leadFormData.email}
                    onChange={handleLeadFormChange}
                    className={styles.inlineInput} 
                    required 
                    placeholder="john@example.com"
                  />
                </div>
                <div className={styles.inlineFormGroup} style={{ marginTop: '8px' }}>
                  <label htmlFor="chat-need" className={styles.inlineLabel}>Project Need</label>
                  <select 
                    id="chat-need"
                    name="need" 
                    value={leadFormData.need}
                    onChange={handleLeadFormChange}
                    className={styles.inlineInput}
                  >
                    <option value="AI Chatbot Integration">AI Chatbot Integration</option>
                    <option value="Custom E-commerce Website">Custom E-commerce Website</option>
                    <option value="iOS & Android App Dev">iOS &amp; Android App Dev</option>
                    <option value="AI Smart Search Engine">AI Smart Search Engine</option>
                    <option value="AI Voice Calling Automation">AI Voice Calling Automation</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className={`btn btn-primary ${styles.inlineBtn}`}
                  style={{ width: '100%' }}
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          )}

          {/* Typing Loading indicator */}
          {loading && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.bubble} style={{ padding: '8px 16px', display: 'flex', gap: '4px' }}>
                <span style={{ animation: 'blink 1.4s infinite 0.2s', width: '6px', height: '6px', backgroundColor: '#888', borderRadius: '50%' }}></span>
                <span style={{ animation: 'blink 1.4s infinite 0.4s', width: '6px', height: '6px', backgroundColor: '#888', borderRadius: '50%' }}></span>
                <span style={{ animation: 'blink 1.4s infinite 0.6s', width: '6px', height: '6px', backgroundColor: '#888', borderRadius: '50%' }}></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Action chips */}
        <div className={styles.quickReplies}>
          <button 
            onClick={() => handleSendMessage(null, "Check pricing & details")}
            className={`${styles.chipBtn} ${styles.chipTeal}`}
          >
            Check Pricing
          </button>
          <button 
            onClick={() => handleSendMessage(null, "Tell me about your services")}
            className={`${styles.chipBtn} ${styles.chipTeal}`}
          >
            See Services
          </button>
          <button 
            onClick={() => handleSendMessage(null, "Hire on Fiverr")}
            className={`${styles.chipBtn} ${styles.chipGreen}`}
          >
            Hire on Fiverr
          </button>
          <button 
            onClick={() => {
              handleSendMessage(null, "I want a free demo");
              setShowLeadForm(true);
            }}
            className={`${styles.chipBtn} ${styles.chipGold}`}
          >
            Request Free Demo
          </button>
        </div>

        {/* Text Input Footer */}
        <div className={styles.chatFooter}>
          <form className={styles.inputForm} onSubmit={handleSendMessage}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.chatInput} 
              placeholder="Ask a question..."
              disabled={loading || showLeadForm}
            />
            <button 
              type="submit" 
              className={styles.sendBtn}
              disabled={loading || !inputValue.trim() || showLeadForm}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
