import { NextResponse } from 'next/server';

// Basic in-memory store for Hackathon demo purposes 
// (If you want this saved permanently, we can pipe it to Firestore later)
let recentCalls: any[] = [];

/**
 * Exotel PassThru Endpoint
 * This URL expects to receive parameters like "From" (caller's number), "To" (your Exotel number), 
 * and "CallSid" (unique call tracker).
 */

export async function GET(req: Request) {
  return handleExotelRequest(req);
}

export async function POST(req: Request) {
  return handleExotelRequest(req);
}

async function handleExotelRequest(req: Request) {
  const url = new URL(req.url);
  let callerId = "";
  let exotelNumber = "";
  let callSid = "";
  let customField = ""; // Usually holds Digits pressed by the user

  try {
    // Exotel can send data either encoded in the URL (GET) or in form-data/JSON (POST)
    if (req.method === 'GET') {
      callerId = url.searchParams.get('From') || "Unknown";
      exotelNumber = url.searchParams.get('To') || "Unknown";
      callSid = url.searchParams.get('CallSid') || "Unknown";
      customField = url.searchParams.get('CustomField') || "";
    } else {
       // Parse POST data - Exotel occasionally sends standard Web-Form bodies
       const formData = await req.formData().catch(() => null);
       if (formData) {
         callerId = formData.get('From') as string || "Unknown";
         exotelNumber = formData.get('To') as string || "Unknown";
         callSid = formData.get('CallSid') as string || "Unknown";
         customField = formData.get('CustomField') as string || "";
       }
    }

    console.log(`[EXOTEL PING] Received call from: ${callerId}`);
    console.log(`[EXOTEL PING] Call tracking SID: ${callSid}`);
    
    if (customField) {
      console.log(`[EXOTEL PING] User inputted characters: ${customField}`);
    }

    // Temporarily save this call log to memory so your Dashboard can theoretically read it
    recentCalls.push({
      timestamp: new Date().toISOString(),
      callerId,
      exotelNumber,
      callSid,
      digitsPressed: customField
    });

    // Exotel requires a standard HTTP 200 OK signal so the IVR flow doesn't hang up
    // You can also return plain text here if you want Exotel's Text-To-Speech to read it out loud
    return new NextResponse('OK', { 
       status: 200, 
       headers: { 'Content-Type': 'text/plain' } 
    });

  } catch (error) {
    console.error("Critical error in Exotel PassThru Router:", error);
    return new NextResponse("Failed to process telephony webhook", { status: 500 });
  }
}

// Optional helper endpoint if you want to verify your logged calls in the browser
export async function PUT(req: Request) {
  return NextResponse.json({
    success: true,
    message: "Recent Exotel pings",
    totalCalls: recentCalls.length,
    logs: recentCalls
  });
}
