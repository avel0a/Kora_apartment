import fs from 'fs';
import path from 'path';

// Mock data
const booking = {
  id: 1,
  guestName: "John Doe",
  guestEmail: "john@example.com",
  checkIn: "2026-04-01",
  checkOut: "2026-04-05",
  adults: 2,
  children: 1,
  status: "confirmed",
  createdAt: new Date()
};

const room = {
  id: 1,
  name: "Executive Room",
  slug: "executive",
  description: "Luxury suite",
  price: 150,
  capacity: 2,
  size: "45m²",
  bedType: "King Size",
  imageUrl: "https://example.com/room.jpg",
  amenities: ["WiFi", "AC"]
};

const contact = {
  id: 1,
  name: "Jane Smith",
  email: "jane@example.com",
  subject: "Wedding Reservation Inquiry",
  message: "Hello,\n\nI would like to inquire about booking 20 rooms for a wedding in June.\n\nPlease let me know the rates and availability.\n\nBest regards,\nJane",
  createdAt: new Date()
};

const config = {
  site_name: "Kora Hotel Suites",
  contact_address: "Bole Road, Addis Ababa, Ethiopia",
  smtp_host: "smtp.mailtrap.io",
  smtp_port: "2525",
  contact_email: "info@korahotelsuites.com"
};

// Paste the baseEmailTemplate and content generation logic here for standalone testing
const siteName = config.site_name || "Kora Hotel Suites";
const primaryColor = "#1a365d"; // Navy
const accentColor = "#fbbd2e"; // Gold
const textColor = "#110f0e";
const lightTextColor = "#6c757d";

function baseEmailTemplate(subject: string, preheader: string, content: string, config: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f4; padding-bottom: 40px; }
    .content { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: ${primaryColor}; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
    .hero { padding: 40px 30px; text-align: center; border-bottom: 1px solid #eeeeee; }
    .hero h2 { color: ${primaryColor}; margin: 0 0 10px 0; font-size: 28px; }
    .hero p { color: ${lightTextColor}; margin: 0; font-size: 16px; }
    .main { padding: 30px; line-height: 1.6; color: ${textColor}; }
    .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fafafa; border-radius: 6px; }
    .details-table td { padding: 12px 15px; border-bottom: 1px solid #eeeeee; }
    .details-table td:first-child { font-weight: 600; width: 40%; color: ${lightTextColor}; }
    .footer { padding: 30px; text-align: center; color: ${lightTextColor}; font-size: 14px; }
    .button { display: inline-block; padding: 12px 24px; background-color: ${primaryColor}; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
    .accent-bar { height: 4px; background-color: ${accentColor}; }
    @media only screen and (max-width: 600px) {
      .content { margin-top: 0; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>
    <div class="content">
      <div class="header">
        <h1>${config.site_name}</h1>
      </div>
      <div class="accent-bar"></div>
      ${content}
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${config.site_name}. All rights reserved.</p>
        <p>${config.contact_address || ''}</p>
        <p>${config.contact_phone || ''} | ${config.contact_email || ''}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate contents
const guestContent = `
    <div class="hero">
      <h2>Booking Confirmed!</h2>
      <p>Dear ${booking.guestName}, thank you for choosing ${config.site_name}.</p>
    </div>
    <div class="main">
      <p>We've received your booking for <strong>${room.name}</strong>. Here are your arrival details:</p>
      <table class="details-table">
        <tr><td>Check-in</td><td>${new Date(booking.checkIn).toLocaleDateString()}</td></tr>
        <tr><td>Check-out</td><td>${new Date(booking.checkOut).toLocaleDateString()}</td></tr>
        <tr><td>Guests</td><td>${booking.adults} Adults, ${booking.children} Children</td></tr>
        <tr><td>Room Type</td><td>${room.name}</td></tr>
      </table>
      <p style="margin-top: 25px;">We are preparing for your arrival and look forward to providing you with an exceptional experience.</p>
      <div style="text-align: center;">
        <a href="#" class="button">Visit Our Website</a>
      </div>
    </div>
`;

const guestHtml = baseEmailTemplate(`Booking Confirmation`, `Your stay is confirmed`, guestContent, config);

const inquiryContent = `
    <div class="hero">
      <h2>New Inquiry Received</h2>
      <p>You have a new message from the contact form.</p>
    </div>
    <div class="main">
      <table class="details-table">
        <tr><td>From</td><td>${contact.name}</td></tr>
        <tr><td>Email</td><td>${contact.email}</td></tr>
        <tr><td>Subject</td><td>${contact.subject}</td></tr>
      </table>
      <p style="margin-top: 20px; font-weight: 600; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message:</p>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #1a365d; font-style: italic;">
        ${contact.message.replace(/\n/g, '<br>')}
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${contact.email}" class="button">Reply to Guest</a>
      </div>
    </div>
`;

const inquiryHtml = baseEmailTemplate(`New Inquiry`, `Message from ${contact.name}`, inquiryContent, config);

// Save to files
const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

fs.writeFileSync(path.join(tmpDir, 'guest_test.html'), guestHtml);
fs.writeFileSync(path.join(tmpDir, 'inquiry_test.html'), inquiryHtml);

console.log("Test HTML files generated in /tmp directory.");
