import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const SYSTEM_PROMPT = `You are the executive AI Sales Consultant for Nabil Ahmad, a premium Full-Stack Developer & AI Automation Specialist.
Your primary objective is to engage leads professionally, answer questions about Nabil's services, and politely but assertively guide the conversation towards booking a "Free 24h Prototype Demo".

CONVERSATION STYLE:
- Professional, elegant, empathetic, and human-like. Keep replies concise (2-4 sentences max per bubble) to maintain a clean chat experience.
- Actively read the client's message. Acknowledge their specific project goal (e.g., if they mention e-commerce, refer to custom web storefronts; if they mention voice bots, refer to Twilio/ElevenLabs automation).
- Provide transparent pricing details: custom websites, app integrations, and chatbots start at just $100. Mention that because Nabil codes from scratch (no bloated template builders), the performance is exceptional.
- Highlight the risk-free offer: Nabil will build a fully functional homepage or AI prototype demo in 24 hours for FREE. They only commit to paying if they love the prototype.

ORDER CONFIRMATION DIRECTIVE:
- Once the user describes their project or expresses interest in getting a quote/demo, tell them: "I would love to lock in this demo for you. Please click the 'Request Free Demo' chip or fill out the registration form so Nabil can begin coding your prototype immediately."
- Actively guide them to order confirmation.

NABIL'S SERVICES:
1. AI Chatbot Development (OpenAI, data-training, custom API prompts)
2. Websites & E-Commerce (Bespoke Next.js, Stripe payment, SEO optimized)
3. iOS & Android App Dev (React Native, offline fluid performance)
4. AI Smart Search (Vector semantic lookup)
5. AI Voice Calling Bots (Twilio, ElevenLabs, n8n webhook automation)`;

export async function POST(request) {
  try {
    const { conversationId, sessionId, message, leadData } = await request.json();

    if (!conversationId || (!message && !leadData)) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Process Lead Data Submission (Inline Chat Form)
    if (leadData) {
      const { name, email, need } = leadData;
      if (name && email) {
        db.saveChatbotLead({
          conversationId,
          sessionId,
          name,
          email,
          service: need || 'AI Automation'
        });
        
        // Return a structured receipt payload format
        const receiptText = `[RECEIPT]
Name:${name}
Email:${email}
Service:${need || 'AI Automation'}
Date:${new Date().toLocaleDateString()}
Status:Scheduled (24h Turnaround)
Reference:#DEMO-${Math.floor(1000 + Math.random() * 9000)}`;

        db.addChatMessage({ conversationId, sender: 'bot', text: receiptText });
        return NextResponse.json({ success: true, reply: receiptText });
      }
    }

    // Log visitor's raw message in database
    db.addChatMessage({ conversationId, sender: 'visitor', text: message });

    // Fetch message history for context
    const conv = db.getConversation(conversationId) || { messages: [] };
    const historyCount = conv.messages.length;

    let reply = '';
    const apiKey = process.env.OPENAI_API_KEY;

    // 2. OpenAI API Completion Call
    if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
      try {
        const historyMessages = [];
        // Extract the last 6 messages to keep context focused
        const recent = conv.messages.slice(-6);
        recent.forEach(m => {
          historyMessages.push({
            role: m.sender === 'visitor' ? 'user' : 'assistant',
            content: m.text
          });
        });

        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...historyMessages
            ],
            temperature: 0.7,
            max_tokens: 200
          })
        });

        if (openAiRes.ok) {
          const aiData = await openAiRes.json();
          reply = aiData.choices[0].message.content;
        }
      } catch (err) {
        console.error('Failed calling OpenAI, falling back to rule-engine:', err);
      }
    }

    // 3. Graceful Fallback Sales Dialogue Engine (Runs if API key is missing or fails)
    if (!reply) {
      const msg = message.toLowerCase();
      
      if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('greetings')) {
        reply = "Hi! I am Nabil's Sales Consultant. I can walk you through Nabil's custom development services, discuss pricing (starting at $100), or help confirm a free prototype demo of your project. What type of website, app, or automation are you looking to build?";
      } 
      else if (msg.includes('price') || msg.includes('pricing') || msg.includes('cost') || msg.includes('fee')) {
        reply = "Nabil's premium custom services start at just **$100** (e.g., custom Next.js landing pages or trained AI chatbots). We build everything from scratch in pure code for maximum speed. \n\nBest of all, Nabil offers a **100% free prototype demo** in 24 hours. You only pay if you love the prototype. What is your project idea? I can check if we can build a free demo for it!";
      } 
      else if (msg.includes('demo') || msg.includes('free demo') || msg.includes('trial') || msg.includes('how it works')) {
        reply = "Our process is simple and risk-free: Nabil codes a functional homepage or AI mockup within 24 hours for free. You review it, and if you love it, we proceed. Otherwise, you owe nothing. Would you like me to open the demo registration panel below?";
      } 
      else if (msg.includes('service') || msg.includes('do you do') || msg.includes('chatbot') || msg.includes('voice') || msg.includes('website') || msg.includes('app')) {
        reply = "Nabil specializes in custom AI chatbots, high-end Next.js/React websites, cross-platform mobile apps (iOS & Android), semantic search engines, and Twilio voice lines. Which system matches your automation needs today?";
      }
      else if (msg.includes('yes') || msg.includes('sure') || msg.includes('ok') || msg.includes('book') || msg.includes('register') || msg.includes('order')) {
        reply = "Excellent choice! I've launched the registration panel. Please fill out your Name and Email below, and Nabil will start coding your custom prototype immediately!";
      }
      else {
        if (historyCount > 4) {
          reply = "That sounds like a very valuable business system! To lock in your order slot for a 100% free functional prototype built in 24 hours, please click the 'Request Free Demo' chip or submit your details in the contact form below.";
        } else {
          reply = `That sounds like a great project! Nabil codes custom solutions for exactly this type of scope, ensuring zero bloated templates and ultra-fast load speeds. \n\nSince Nabil provides a **100% free demo first**, we can code a prototype for you in 24 hours. Would you like to confirm a free demo?`;
        }
      }
    }

    // Log bot response in database
    db.addChatMessage({ conversationId, sender: 'bot', text: reply });

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
