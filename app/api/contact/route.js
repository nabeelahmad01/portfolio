import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const { name, email, business, service, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save lead to DB
    const lead = db.createLead({
      name,
      email,
      business,
      service,
      message,
      source: 'contact_form'
    });

    // Simulate Email Dispatch Notification to Nabil
    console.log(`
======================================================
📧 EMAIL NOTIFICATION SENT TO: nabildev.wepapp@gmail.com
======================================================
Subject: New Project Inquiry from ${name}
From: ${email}
Business: ${business || 'N/A'}
Service Selected: ${service || 'General inquiry'}

Message:
"${message}"

------------------------------------------------------
Logged Lead ID: #${lead.id}
======================================================
    `);

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
