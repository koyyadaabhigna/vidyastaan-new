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
    // Exotel usually prefixes zero (09876543210) or country codes (+91...).
    // Firebase registrations usually hold pure 10 digit strings.
    let searchPhone = callerId;
    if (searchPhone !== "Unknown" && searchPhone.length >= 10) {
       searchPhone = searchPhone.slice(-10); // Extract the last core 10 digits accurately
    }

    // 3. SECURE FIREBASE DATABASE CHECK
    // Determine if the caller inherently exists inside the Edubridge Students collection
    console.log(`[FIREBASE] Checking Database for registered number: ${searchPhone}...`);
    
    const studentsRef = collection(db, COLLECTIONS.STUDENTS);
    const q = query(studentsRef, where("phone", "==", searchPhone));
    const querySnapshot = await getDocs(q);

    // 4. DYNAMIC EXOTEL RESPONSE BRANCHING!
    // If the database returns completely 0 matches for that phone string:
    if (querySnapshot.empty) {
        console.log(`[FIREBASE] ❌ Number ${searchPhone} is NOT REGISTERED! Crashing Passthru.`);
        // Returning HTTP 404 forces Exotel App Builder to drop down the Red "Fail" path 
        // immediately playing your "unregistered" voice recording!
        return new NextResponse('User Not Registered', { 
            status: 404, 
            headers: { 'Content-Type': 'text/plain' } 
        });
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
