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

    // 2. Data Normalization
    let searchPhone = callerId;
    if (searchPhone !== "Unknown" && searchPhone.length >= 10) {
       searchPhone = searchPhone.slice(-10); // Extract the last core 10 digits
    }

    // 3. SECURE FIREBASE DATABASE CHECK
    console.log(`[FIREBASE] Checking Database for registered number: ${searchPhone}...`);
    
    // Safety check for Vercel Environment Variables
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
       console.error("[FIREBASE] ERROR: Vercel environment variables are NOT SET!");
    }

    const usersRef = collection(db, COLLECTIONS.USERS);
    // Check for the most common Indian formats: raw 10-digit, +91, and 0 prefix
    const q = query(usersRef, where("phone", "in", [searchPhone, `+91${searchPhone}`, `0${searchPhone}`]));
    const querySnapshot = await getDocs(q);

    // 4. DYNAMIC EXOTEL RESPONSE BRANCHING!
    if (querySnapshot.empty) {
        console.log(`[FIREBASE] ❌ Number ${searchPhone} not found in USERS. Checking STUDENTS...`);
        // Fallback: Some systems store it in the 'students' collection directly
        const studentsRef = collection(db, COLLECTIONS.STUDENTS);
        const q2 = query(studentsRef, where("phone", "in", [searchPhone, `+91${searchPhone}`, `0${searchPhone}`]));
        const snap2 = await getDocs(q2);
        
        if (snap2.empty) {
            console.log(`[FIREBASE] ❌ Number ${searchPhone} is definitively NOT REGISTERED.`);
            return new NextResponse('User Not Registered', { 
                status: 404, 
                headers: { 'Content-Type': 'text/plain', 'X-Debug-Phone': searchPhone } 
            });
        }
        
        // Match found in students collection!
        const studentData = snap2.docs[0].data();
        return new NextResponse(`Hello ${studentData.name}!`, { status: 200 });
    }

    // If the snapshot has data, the user exists as an active student!
    console.log(`[FIREBASE] ✅ Number ${searchPhone} MATCHED a Student Profile. Approving Passthru.`);
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
