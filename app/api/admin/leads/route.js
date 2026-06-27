import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    // 1. Session verification check
    const cookie = request.cookies.get('nabil_admin_session');
    if (!cookie || cookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch inbox lists
    const leads = db.getLeads();
    const conversations = db.getConversations();

    return NextResponse.json({ leads, conversations });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // 1. Session verification check
    const cookie = request.cookies.get('nabil_admin_session');
    if (!cookie || cookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId, status } = await request.json();
    if (!leadId || !status) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 2. Process status update
    const updatedLead = db.updateLeadStatus(leadId, status);
    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error('Lead Status Update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
