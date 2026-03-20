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
  const guestMailOptions = {
    from: `"${siteName}" <${fromEmail}>`,
    to: booking.guestEmail,
    subject: `Booking Confirmation - ${siteName}`,
    html: `
      <h1>Booking Confirmation</h1>
      <p>Dear ${booking.guestName},</p>
      <p>Thank you for choosing ${siteName}. Your booking for <strong>${room.name}</strong> has been received.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Check-in: ${new Date(booking.checkIn).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(booking.checkOut).toLocaleDateString()}</li>
        <li>Guests: ${booking.adults} Adults, ${booking.children} Children</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `,
  };

  // 2. Email to Admin
  const adminMailOptions = {
    from: `"${siteName} System" <${fromEmail}>`,
    to: adminEmail,
    subject: `New Booking Notification - ${booking.guestName}`,
    html: `
      <h1>New Booking Received</h1>
      <p>A new booking has been made on the website:</p>
      <ul>
        <li><strong>Guest:</strong> ${booking.guestName} (${booking.guestEmail})</li>
        <li><strong>Room:</strong> ${room.name}</li>
        <li><strong>Dates:</strong> ${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()}</li>
      </ul>
      <p><a href="${process.env.APP_URL || ''}/admin">View in Admin Panel</a></p>
    `,
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

  const mailOptions = {
    from: `"${siteName} Contact" <${fromEmail}>`,
    to: adminEmail,
    subject: `New Inquiry: ${contact.subject}`,
    html: `
      <h1>New Inquiry Received</h1>
      <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message.replace(/\n/g, '<br>')}</p>
    `,
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
