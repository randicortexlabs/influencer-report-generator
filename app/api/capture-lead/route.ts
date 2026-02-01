import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json();
    
    const {
      fullName,
      email,
      phone,
      userType,
      conversionInterest,
      campaignName,
      totalInvestment
    } = leadData;
    
    // Validate required fields
    if (!fullName || !email || !userType || !conversionInterest) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Send to Google Sheets webhook (if configured)
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            fullName,
            email,
            phone: phone || 'N/A',
            userType,
            conversionInterest,
            campaignName,
            totalInvestment,
          })
        });
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Don't fail the request if webhook fails
      }
    }
    
    // Log lead to console (for debugging)
    console.log('Lead captured:', {
      timestamp: new Date().toISOString(),
      email,
      userType,
      conversionInterest
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Lead captured successfully'
    });
    
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Failed to save lead information' },
      { status: 500 }
    );
  }
}
