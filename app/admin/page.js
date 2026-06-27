'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminDashboard.module.css';
import { 
  Users, 
  MessageSquare, 
  Briefcase, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Calendar,
  Layers,
  Search,
  MessageCircle,
  Eye,
  Mail,
  User,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview | leads | conversations
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Session check on mount
  const checkAuthAndFetchData = useCallback(async () => {
    try {
      const authRes = await fetch('/api/admin/auth');
      const authData = await authRes.json();

      if (!authData.authenticated) {
        router.push('/admin/login');
        return;
      }
      setAuthChecked(true);

      // Fetch dashboard metrics
      const [statsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/leads')
      ]);

      if (statsRes.ok && leadsRes.ok) {
        const statsData = await statsRes.json();
        const leadsData = await leadsRes.json();
        setStats(statsData);
        setLeads(leadsData.leads || []);
        setConversations(leadsData.conversations || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndFetchData();
  }, [checkAuthAndFetchData]);

  // Update lead status
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: newStatus })
      });

      if (res.ok) {
        // Refresh leads data locally
        setLeads(prevLeads => 
          prevLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l)
        );
        // Refresh stats
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  if (loading || !authChecked) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)' }}>
        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Loading Administrator Console...</p>
      </div>
    );
  }

  // Helper to draw clean Custom SVG Line Chart
  const renderTrafficChart = () => {
    if (!stats || !stats.dailyTraffic || stats.dailyTraffic.length === 0) return null;

    const data = stats.dailyTraffic;
    const width = 600;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Find max value for scaling
    const maxVal = Math.max(...data.map(d => Math.max(d.views, d.visitors)), 10);
    const scaleY = (val) => chartHeight - (val / maxVal) * chartHeight + paddingTop;
    const scaleX = (index) => paddingLeft + (index / (data.length - 1)) * chartWidth;

    // Create line paths
    let viewsPath = '';
    let visitorsPath = '';

    data.forEach((d, i) => {
      const x = scaleX(i);
      const yViews = scaleY(d.views);
      const yVisitors = scaleY(d.visitors);

      if (i === 0) {
        viewsPath = `M ${x} ${yViews}`;
        visitorsPath = `M ${x} ${yVisitors}`;
      } else {
        viewsPath += ` L ${x} ${yViews}`;
        visitorsPath += ` L ${x} ${yVisitors}`;
      }
    });

    return (
      <div className={styles.chartContainer}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg} style={{ width: '100%', height: '100%' }}>
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
            const val = Math.round(maxVal * r);
            const y = scaleY(val);
            return (
              <g key={idx}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="var(--border-light)" strokeWidth={1} />
                <text x={paddingLeft - 8} y={y + 4} className={styles.chartLabelY}>{val}</text>
              </g>
            );
          })}

          {/* Line drawings */}
          <path d={viewsPath} fill="none" stroke="var(--primary-teal)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          <path d={visitorsPath} fill="none" stroke="var(--secondary-gold)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points and Axis Labels */}
          {data.map((d, i) => {
            const x = scaleX(i);
            return (
              <g key={i}>
                <circle cx={x} cy={scaleY(d.views)} r={4} fill="var(--primary-teal)" />
                <circle cx={x} cy={scaleY(d.visitors)} r={4} fill="var(--secondary-gold)" />
                <text x={x} y={height - 8} className={styles.chartLabelX}>{d.day}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      {/* Title */}
      <div className={styles.titleBlock}>
        <div>
          <h1 className={styles.title}>System Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time visitor patterns and incoming leads</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Overview &amp; Traffic
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'leads' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          <Briefcase size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Leads Inbox ({leads.length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'conversations' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('conversations')}
        >
          <MessageSquare size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Chatbot Logs ({conversations.length})
        </button>
      </div>

      {/* Tab Content 1: Overview and traffic */}
      {activeTab === 'overview' && stats && (
        <>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statTitle}>Total Visitors</span>
              <span className={styles.statValue}>{stats.overview.totalVisitors}</span>
              <span className={styles.statFooter}>All-time sessions logged</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statTitle}>Active Last 7 Days</span>
              <span className={styles.statValue} style={{ color: 'var(--secondary-gold)' }}>
                {stats.overview.recent7Days}
              </span>
              <span className={styles.statFooter}>Recent active sessions</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statTitle}>Total Leads Captured</span>
              <span className={styles.statValue}>{stats.overview.totalLeads}</span>
              <span className={styles.statFooter}>Contact form + Chatbot leads</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statTitle}>Conversion Rate</span>
              <span className={styles.statValue}>
                {stats.overview.conversionRate}%
              </span>
              <span className={styles.statFooter}>Leads generated per visitor</span>
            </div>
          </div>

          {/* Chart and Geo breakdown */}
          <div className={styles.analyticsRow}>
            {/* Custom Chart */}
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Traffic (Last 7 Days)</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--primary-teal)' }}>● Page Views</span>
                  <span style={{ color: 'var(--secondary-gold)' }}>● Unique Visitors</span>
                </div>
              </div>
              {renderTrafficChart()}
            </div>

            {/* Visitors Device & Ratio Info */}
            <div className={styles.chartCard} style={{ gap: '20px' }}>
              <h3 className={styles.cardTitle}>Audience Ratios</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>New Visitors</span>
                  <span style={{ fontWeight: 600 }}>{stats.overview.newVisitors}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>Returning Visitors</span>
                  <span style={{ fontWeight: 600 }}>{stats.overview.returningVisitors}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>Device breakdown</span>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <Smartphone size={16} /> Mobile: {stats.recentVisits.filter(v => v.device === 'Mobile').length} logged
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <Globe size={16} /> Desktop: {stats.recentVisits.filter(v => v.device === 'Desktop').length} logged
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Table */}
          <div className={styles.tableCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recent Activity Logs</h3>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Visited Path</th>
                    <th>Device</th>
                    <th>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentVisits.map((visit, i) => (
                    <tr key={i}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={14} /> {new Date(visit.createdAt).toLocaleString()}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{visit.path}</td>
                      <td>{visit.device}</td>
                      <td>{visit.country}</td>
                    </tr>
                  ))}
                  {stats.recentVisits.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>No visitor records logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab Content 2: Leads Inbox */}
      {activeTab === 'leads' && (
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Inquiries Inbox</h3>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Source</th>
                  <th>Service Requested</th>
                  <th>Date Logged</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{lead.name}</div>
                      <div style={{ fontSize: '0.75rem' }}>{lead.email}</div>
                      {lead.business && <div style={{ fontSize: '0.75rem', italic: true }}>{lead.business}</div>}
                    </td>
                    <td>
                      <span className={`${styles.sourceBadge} ${
                        lead.source === 'contact_form' ? styles.sourceContact : styles.sourceChatbot
                      }`}>
                        {lead.source === 'contact_form' ? 'Contact Form' : 'Chatbot'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{lead.service || 'N/A'}</td>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={styles.statusSelect}
                        style={{
                          color: lead.status === 'CONVERTED' ? '#2A8C76' : lead.status === 'CONTACTED' ? '#E0A458' : lead.status === 'NOT_INTERESTED' ? '#ff5f56' : 'var(--text-dark)',
                          fontWeight: 600
                        }}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="NOT_INTERESTED">Not Interested</option>
                      </select>
                    </td>
                    <td>
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        <Eye size={12} style={{ marginRight: '4px' }} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>No lead inquiries recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Chatbot Logs */}
      {activeTab === 'conversations' && (
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Live Assistant Conversations</h3>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Conv. ID</th>
                  <th>Visitor Profile</th>
                  <th>Total Messages</th>
                  <th>Last Message Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conv) => (
                  <tr key={conv.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{conv.id.substring(0, 10)}...</td>
                    <td>
                      {conv.name ? (
                        <>
                          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{conv.name}</div>
                          <div style={{ fontSize: '0.75rem' }}>{conv.email}</div>
                        </>
                      ) : (
                        <span style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>Anonymous Session</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{conv.messages.length} messages</td>
                    <td>{new Date(conv.updatedAt).toLocaleString()}</td>
                    <td>
                      <button 
                        onClick={() => setSelectedConversation(conv)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        <Eye size={12} style={{ marginRight: '4px' }} /> Read Transcript
                      </button>
                    </td>
                  </tr>
                ))}
                {conversations.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No chatbot dialogue transcripts recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Lead Details view */}
      {selectedLead && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedLead(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Lead Details: {selectedLead.name}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedLead(null)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>Email Address</span>
                  <span className={styles.detailVal}>{selectedLead.email}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>Business</span>
                  <span className={styles.detailVal}>{selectedLead.business || 'N/A'}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>Service Requested</span>
                  <span className={styles.detailVal}>{selectedLead.service || 'N/A'}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>Logged Date</span>
                  <span className={styles.detailVal}>{new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className={styles.detailField} style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <span className={styles.detailLabel}>Message / Context</span>
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '8px', color: 'var(--text-dark)' }}>
                  {selectedLead.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Chatbot Transcript read */}
      {selectedConversation && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedConversation(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Transcript: {selectedConversation.name || 'Anonymous Session'}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedConversation(null)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>Contact Email</span>
                  <span className={styles.detailVal}>{selectedConversation.email || 'Anonymous'}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>Session Started</span>
                  <span className={styles.detailVal}>{new Date(selectedConversation.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className={styles.detailField} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className={styles.detailLabel}>Conversation Log</span>
                <div className={styles.transcriptLog}>
                  {selectedConversation.messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={`${styles.transcriptMsg} ${m.sender === 'bot' ? styles.botMsg : styles.visitorMsg}`}
                    >
                      <div>{m.text}</div>
                      <span className={styles.msgMeta}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
