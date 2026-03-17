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
  console.log("   ALL Login Headers:");
  for (const [key, value] of loginRes.headers.entries()) {
    console.log(`     ${key}: ${value}`);
  }
  
  const setCookies = loginRes.headers.getSetCookie?.() || [];
  console.log("   Set-Cookie headers (getSetCookie):", setCookies);

  console.log("\n3. Testing fallback /api/bookings (NO AUTH)...");
  const fallbackRes = await fetch(`${baseUrl}/api/bookings`);
  console.log("   Status:", fallbackRes.status);
  if (fallbackRes.ok) {
    const data = await fallbackRes.json();
    console.log("   Bookings returned:", data.length);
    if (data.length > 0) {
      console.log("   First booking guest:", data[0].guestName);
    }
  }

  console.log("\n4. Checking server environment...");
  const debugSessionRes = await fetch(`${baseUrl}/api/debug-session`);
  if (debugSessionRes.ok) {
     const debugInfo = await debugSessionRes.json();
     console.log("   Debug Session Info:", JSON.stringify(debugInfo, null, 2));
  }
}

diagnose().catch(console.error);
