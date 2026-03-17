// Using built-in fetch in Node.js 22


async function testAuth() {
  const baseUrl = "http://localhost:5001";
  
  // 1. Try to login
  console.log("Attempting login...");
  const loginRes = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin123" }),
  });
  
  console.log("Login status:", loginRes.status);
  const cookie = loginRes.headers.get("set-cookie");
  console.log("Set-Cookie header:", cookie);

  if (!cookie) {
    console.log("No cookie returned. Login probably failed or something is wrong.");
    return;
  }

  // 2. Try to get bookings with the cookie
  console.log("Attempting to get bookings...");
  const bookingsRes = await fetch(`${baseUrl}/api/bookings`, {
    headers: { "Cookie": cookie },
  });
  
  console.log("Bookings status:", bookingsRes.status);
  if (bookingsRes.ok) {
    const data = await bookingsRes.json();
    console.log("Bookings count:", data.length);
  } else {
    const text = await bookingsRes.text();
    console.log("Bookings error body:", text);
  }
}

testAuth().catch(console.error);
