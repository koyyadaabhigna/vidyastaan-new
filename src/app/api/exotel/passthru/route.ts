import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/db";

// Keep a lightweight log for your demo dashboard locally if needed
let recentCalls: any[] = [];

/**
 * Exotel PassThru Dynamic Endpoint
 * This URL expects to receive parameters like "From" (caller's number), "To" (your Exotel number).
 * It dynamically connects to Firebase, queries the student's dataset, and returns 404 if they are missing.
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
  let customField = ""; 

  try {
    // 1. Exotel Webhook Input Parsing
    if (req.method === 'GET') {
      callerId = url.searchParams.get('From') || "Unknown";
      exotelNumber = url.searchParams.get('To') || "Unknown";
      callSid = url.searchParams.get('CallSid') || "Unknown";
      customField = url.searchParams.get('CustomField') || "";
    } else {
       const formData = await req.formData().catch(() => null);
       if (formData) {
         callerId = formData.get('From') as string || "Unknown";
         exotelNumber = formData.get('To') as string || "Unknown";
         callSid = formData.get('CallSid') as string || "Unknown";
         customField = formData.get('CustomField') as string || "";
       }
    }

    console.log(`[EXOTEL PING] Analyzing Call from: ${callerId}`);

    // Log internally for the session local demo
    recentCalls.push({ timestamp: new Date().toISOString(), callerId, exotelNumber, callSid });

    // 2. Data Sanitization
    // Exotel/Telecoms send weird formats (+91, spaces, 0 prefix). 
    // We strip everything but pure numbers.
    const cleanCallerId = callerId.replace(/\D/g, ''); 
    const core10Digits = cleanCallerId.slice(-10);

    // 3. SECURE FIREBASE DATABASE CHECK
    console.log(`[FIREBASE] Checking Database for registered number: ${cleanCallerId}...`);
    
    const usersRef = collection(db, COLLECTIONS.USERS);
    // We check for: Raw 11-digit, Core 10-digit, and common Prefixes.
    const searchTerms = Array.from(new Set([
        cleanCallerId, 
        core10Digits, 
        `+91${core10Digits}`, 
        `0${core10Digits}`
    ]));

    const q = query(usersRef, where("phone", "in", searchTerms));
    const querySnapshot = await getDocs(q);

    // 4. DYNAMIC EXOTEL RESPONSE BRANCHING!
    if (querySnapshot.empty) {
        console.log(`[FIREBASE] ❌ Number ${cleanCallerId} not found in USERS. Checking STUDENTS...`);
        const studentsRef = collection(db, COLLECTIONS.STUDENTS);
        const q2 = query(studentsRef, where("phone", "in", searchTerms));
        const snap2 = await getDocs(q2);
        
        if (snap2.empty) {
            console.log(`[FIREBASE] ❌ Number ${cleanCallerId} is definitively NOT REGISTERED.`);
            return new NextResponse('User Not Registered', { 
                status: 404, 
                headers: { 'Content-Type': 'text/plain', 'X-Debug-Phone': cleanCallerId } 
            });
        }
        
        const studentData = snap2.docs[0].data();
        return new NextResponse(`Hello ${studentData.name}!`, { status: 200 });
    }

    // If the snapshot has data, the user exists as an active student!
    console.log(`[FIREBASE] ✅ Number ${cleanCallerId} MATCHED a Student Profile. Approving Passthru.`);
    const studentData = querySnapshot.docs[0].data();
    
    // Returning standard HTTP 200 OK forces Exotel App Builder down the Green "Success" path
    return new NextResponse(`Hello ${studentData.name || 'Student'}!`, { 
       status: 200, 
       headers: { 'Content-Type': 'text/plain' } 
    });

  } catch (error) {
    console.error("Critical error in Exotel PassThru Router:", error);
    return new NextResponse("Failed to process telephony webhook", { status: 500 });
  }
}

// Optional helper endpoint
export async function PUT(req: Request) {
  return NextResponse.json({
    success: true,
    totalCalls: recentCalls.length,
    logs: recentCalls
  });
}
