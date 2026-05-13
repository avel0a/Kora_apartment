async function diagnose() {
  const baseUrl = "http://localhost:5001";
  
  console.log("1. Checking server health...");
  const health = await fetch(`${baseUrl}/api/rooms`);
  console.log("   /api/rooms status:", health.status);

  console.log("\n2. Attempting login as admin...");
  const loginRes = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin123" }),
  });
  
  console.log("   Login status:", loginRes.status);
  
  const setCookies = loginRes.headers.getSetCookie?.() || [];
  const sessionCookie = setCookies.find(c => c.startsWith('connect.sid='))?.split(';')[0];
  console.log("   Session Cookie:", sessionCookie);

  const authHeaders = sessionCookie ? { "Cookie": sessionCookie } : {};

  console.log("\n3. Testing /api/admin/bookings (AUTH REQUIRED)...");
  const fallbackRes = await fetch(`${baseUrl}/api/admin/bookings`, { headers: authHeaders });
  console.log("   Status:", fallbackRes.status);
  if (fallbackRes.ok) {
    const data = await fallbackRes.json();
    console.log("   Bookings returned:", data.length);
    if (data.length > 0) {
      console.log("   First booking guest:", data[0].guestName);
    }
  }

  console.log("\n4. Checking server environment...");
  const debugSessionRes = await fetch(`${baseUrl}/api/debug-session`, { headers: authHeaders });
  if (debugSessionRes.ok) {
     const debugInfo = await debugSessionRes.json();
     console.log("   Debug Session Info:", JSON.stringify(debugInfo, null, 2));
  } else {
     console.log("   Failed to get debug session, status:", debugSessionRes.status);
  }
}

diagnose().catch(console.error);
