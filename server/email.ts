import nodemailer from "nodemailer";
import { storage } from "./storage";
import { type Booking, type Room, type Contact } from "@shared/schema";

async function getTransporter() {
  const settings = await storage.getSettings();
  const config: Record<string, string> = {};
  settings.forEach(s => {
    config[s.key] = s.value;
  });

  if (!config.smtp_host || !config.smtp_user || !config.smtp_pass) {
    console.log("[Email] SMTP settings missing, skipping email sending.");
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp_host,
    port: parseInt(config.smtp_port || "587"),
    secure: config.smtp_port === "465",
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });
}

function baseEmailTemplate(subject: string, preheader: string, content: string, config: any) {
  const siteName = config.site_name || "Modern Panda Hotel";
  const primaryColor = "#d91a3c"; // Crimson
  const accentColor = "#fbbd2e"; // Gold
  const textColor = "#110f0e";
  const lightTextColor = "#6c757d";

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
    <!-- Preheader text -->
    <div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>
    
    <div class="content">
      <div class="header">
        <h1>${siteName}</h1>
      </div>
      <div class="accent-bar"></div>
      
      ${content}
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        <p>${config.contact_address || ''}</p>
        <p>${config.contact_phone || ''} | ${config.contact_email || ''}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendBookingEmails(booking: Booking, room: Room) {
  const transporter = await getTransporter();
  if (!transporter) return;

  const settings = await storage.getSettings();
  const config: Record<string, string> = {};
  settings.forEach(s => {
    config[s.key] = s.value;
  });

  const siteName = config.site_name || "Modern Panda Hotel";
  const fromEmail = config.smtp_from || "noreply@momonahotel.com";
  const adminEmail = config.admin_booking_email || config.contact_email;

  // 1. Email to Guest
  const guestContent = `
    <div class="hero">
      <h2>Booking Confirmed!</h2>
      <p>Dear ${booking.guestName}, thank you for choosing ${siteName}.</p>
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
        <a href="${process.env.APP_URL || ''}" class="button">Visit Our Website</a>
      </div>
    </div>
  `;

  const guestMailOptions = {
    from: `"${siteName}" <${fromEmail}>`,
    to: booking.guestEmail,
    subject: `Booking Confirmation - ${siteName}`,
    html: baseEmailTemplate(
      `Booking Confirmation - ${siteName}`,
      `Your booking for ${room.name} is confirmed.`,
      guestContent,
      config
    ),
  };

  // 2. Email to Admin
  const adminContent = `
    <div class="hero">
      <h2>New Booking Received</h2>
      <p>A new reservation has been made via the website.</p>
    </div>
    <div class="main">
      <table class="details-table">
        <tr><td>Guest Name</td><td>${booking.guestName}</td></tr>
        <tr><td>Email</td><td>${booking.guestEmail}</td></tr>
        <tr><td>Room</td><td>${room.name}</td></tr>
        <tr><td>Check-in</td><td>${new Date(booking.checkIn).toLocaleDateString()}</td></tr>
        <tr><td>Check-out</td><td>${new Date(booking.checkOut).toLocaleDateString()}</td></tr>
      </table>
      
      <div style="text-align: center;">
        <a href="${process.env.APP_URL || ''}/admin" class="button">View in Admin Panel</a>
      </div>
    </div>
  `;

  const adminMailOptions = {
    from: `"${siteName} System" <${fromEmail}>`,
    to: adminEmail,
    subject: `New Booking: ${booking.guestName}`,
    html: baseEmailTemplate(
      `New Booking Notification`,
      `New booking from ${booking.guestName} for ${room.name}.`,
      adminContent,
      config
    ),
  };

  try {
    await transporter.sendMail(guestMailOptions);
    if (adminEmail) {
      await transporter.sendMail(adminMailOptions);
    }
    console.log(`[Email] Booking emails sent for booking #${booking.id}`);
  } catch (error) {
    console.error("[Email] Failed to send booking emails:", error);
  }
}

export async function sendInquiryEmail(contact: Contact) {
  const transporter = await getTransporter();
  if (!transporter) return;

  const settings = await storage.getSettings();
  const config: Record<string, string> = {};
  settings.forEach(s => {
    config[s.key] = s.value;
  });

  const siteName = config.site_name || "Modern Panda Hotel";
  const fromEmail = config.smtp_from || "noreply@momonahotel.com";
  const adminEmail = config.admin_booking_email || config.contact_email;

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
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #d91a3c; font-style: italic;">
        ${contact.message.replace(/\n/g, '<br>')}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${contact.email}?subject=Re: ${contact.subject}" class="button">Reply to Guest</a>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"${siteName} Contact" <${fromEmail}>`,
    to: adminEmail,
    subject: `New Inquiry: ${contact.subject}`,
    html: baseEmailTemplate(
      `New Inquiry Received`,
      `Message from ${contact.name}: ${contact.subject}`,
      inquiryContent,
      config
    ),
  };

  try {
    if (adminEmail) {
      await transporter.sendMail(mailOptions);
      console.log(`[Email] Inquiry email sent for contact #${contact.id}`);
    }
  } catch (error) {
    console.error("[Email] Failed to send inquiry email:", error);
  }
}
