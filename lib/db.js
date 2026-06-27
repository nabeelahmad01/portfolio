import fs from 'fs';
import path from 'path';

// Store db.json in /tmp on Vercel as it's the only writable directory, or locally in project root
const DB_PATH = process.env.VERCEL 
  ? '/tmp/db.json' 
  : path.join(process.cwd(), 'db.json');

// Initialize database template
const DEFAULT_DB = {
  sessions: [],
  visits: [],
  leads: [],
  chatConversations: []
};

// Helper: Read database from file
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(DEFAULT_DB));
    }
    const content = fs.readFileSync(DB_PATH, 'utf8');
    const data = JSON.parse(content || '{}');
    return {
      sessions: data.sessions || [],
      visits: data.visits || [],
      leads: data.leads || [],
      chatConversations: data.chatConversations || []
    };
  } catch (error) {
    console.error('Error reading database file, using fallback template:', error);
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
}

// Helper: Save database to file
function saveDb(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving database file:', error);
    return false;
  }
}

// DB Interface Operations
export const db = {
  // Visitor Tracking
  logVisit({ sessionId, path: urlPath, referrer = '', country = 'Unknown', device = 'Desktop' }) {
    const data = readDb();
    const now = new Date().toISOString();

    // 1. Session tracking
    let session = data.sessions.find(s => s.id === sessionId);
    if (!session) {
      session = {
        id: sessionId,
        createdAt: now,
        updatedAt: now,
        country,
        device
      };
      data.sessions.push(session);
    } else {
      session.updatedAt = now;
    }

    // 2. Page View tracking
    const newVisit = {
      id: data.visits.length + 1,
      sessionId,
      path: urlPath,
      referrer,
      country,
      device,
      createdAt: now
    };
    data.visits.push(newVisit);

    saveDb(data);
    return { session, visit: newVisit };
  },

  // Lead Generation (Contact Form)
  createLead({ name, email, business = '', service = '', message = '', source = 'contact_form' }) {
    const data = readDb();
    const newLead = {
      id: data.leads.length + 1,
      name,
      email,
      business,
      service,
      message,
      source,
      status: 'NEW', // NEW, CONTACTED, CONVERTED, NOT_INTERESTED
      createdAt: new Date().toISOString()
    };
    data.leads.push(newLead);
    saveDb(data);
    return newLead;
  },

  getLeads() {
    const data = readDb();
    return [...data.leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  updateLeadStatus(id, status) {
    const data = readDb();
    const lead = data.leads.find(l => l.id === parseInt(id));
    if (lead) {
      lead.status = status;
      saveDb(data);
      return lead;
    }
    return null;
  },

  // Chatbot Conversations
  addChatMessage({ conversationId, sender, text }) {
    const data = readDb();
    const now = new Date().toISOString();

    let conv = data.chatConversations.find(c => c.id === conversationId);
    if (!conv) {
      conv = {
        id: conversationId,
        sessionId: null,
        name: '',
        email: '',
        status: 'NEW',
        createdAt: now,
        updatedAt: now,
        messages: []
      };
      data.chatConversations.push(conv);
    }

    const newMessage = {
      id: conv.messages.length + 1,
      sender, // 'visitor' | 'bot'
      text,
      createdAt: now
    };

    conv.messages.push(newMessage);
    conv.updatedAt = now;
    saveDb(data);
    return { conversation: conv, message: newMessage };
  },

  saveChatbotLead({ conversationId, sessionId = null, name, email, service = 'AI Automation' }) {
    const data = readDb();
    const now = new Date().toISOString();

    let conv = data.chatConversations.find(c => c.id === conversationId);
    if (!conv) {
      conv = {
        id: conversationId,
        sessionId,
        name,
        email,
        status: 'NEW',
        createdAt: now,
        updatedAt: now,
        messages: []
      };
      data.chatConversations.push(conv);
    } else {
      conv.name = name;
      conv.email = email;
      if (sessionId) conv.sessionId = sessionId;
      conv.updatedAt = now;
    }

    // Add to leads inbox as chatbot source
    const existingLead = data.leads.find(l => l.email === email && l.source === 'chatbot');
    if (!existingLead) {
      const newLead = {
        id: data.leads.length + 1,
        name,
        email,
        business: 'Chatbot Captured',
        service,
        message: `Lead captured via live chatbot dialogue (Conversation ID: ${conversationId}).`,
        source: 'chatbot',
        status: 'NEW',
        createdAt: now
      };
      data.leads.push(newLead);
    }

    saveDb(data);
    return conv;
  },

  getConversations() {
    const data = readDb();
    return [...data.chatConversations].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  getConversation(id) {
    const data = readDb();
    return data.chatConversations.find(c => c.id === id) || null;
  },

  // Analytics Aggregation Engine
  getAnalyticsStats() {
    const data = readDb();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalSessions = data.sessions.length;
    const recentSessions = data.sessions.filter(s => new Date(s.createdAt) >= sevenDaysAgo).length;

    // Calculate new vs returning (sessions with > 1 visits are returning)
    const sessionVisitCounts = {};
    data.visits.forEach(v => {
      sessionVisitCounts[v.sessionId] = (sessionVisitCounts[v.sessionId] || 0) + 1;
    });

    let newVisitors = 0;
    let returningVisitors = 0;
    Object.values(sessionVisitCounts).forEach(count => {
      if (count > 1) {
        returningVisitors++;
      } else {
        newVisitors++;
      }
    });

    const totalLeads = data.leads.length;
    const conversionRate = totalSessions > 0 ? ((totalLeads / totalSessions) * 100).toFixed(1) : 0;

    // Get traffic by day for the last 7 days
    const dailyTraffic = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayKey = d.toISOString().split('T')[0];

      const pageViews = data.visits.filter(v => v.createdAt.startsWith(dayKey)).length;
      const uniqueVisitors = data.sessions.filter(s => s.createdAt.startsWith(dayKey)).length;

      dailyTraffic.push({
        day: dayStr,
        views: pageViews,
        visitors: uniqueVisitors
      });
    }

    // Recent visits logs
    const recentVisits = [...data.visits]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(v => ({
        id: v.id,
        createdAt: v.createdAt,
        path: v.path,
        country: v.country,
        device: v.device
      }));

    return {
      overview: {
        totalVisitors: totalSessions,
        recent7Days: recentSessions,
        newVisitors,
        returningVisitors,
        totalLeads,
        conversionRate: parseFloat(conversionRate)
      },
      dailyTraffic,
      recentVisits
    };
  }
};
