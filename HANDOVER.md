# Kora Hotel Suites — Final Project Handover Document

> **Project Name:** Kora Hotel Suites (Kora Apartment)  
> **Handover Date:** October 2026  
> **Prepared For:** Abel / Kora Hotel Management Team  
> **Environment:** Node.js (v20+), Express, React 18, Vite, Drizzle ORM, Tailwind CSS, PGlite/PostgreSQL  

---

## 1. Executive Summary

Kora Hotel Suites is a full-stack web application designed for a luxury serviced apartment hotel located in Addis Ababa, Ethiopia. It includes a responsive public-facing website with online booking requests, contact inquiry routing, and an administrative Content Management System (CMS) for managing suites, gallery photos, reservations, and site settings.

---

## 2. Key Features Implemented

### 🏨 Suites & Accommodation System
- **Accurate Suite Profiles:** 4 signature suites configured with exact bedroom configurations, sizes, bed types, and detailed amenities:
  - **Junior Suite:** 110 m² | 2 Bedrooms (King + 2 Single beds) | Up to 4 guests
  - **Senior Suite:** 175 m² | 3 Bedrooms (2 King + Queen bed, all en-suite) | Up to 6 guests
  - **Penthouse Suite:** 290 m² | 4 Bedrooms (2 King + Queen + 2 Singles, en-suite) | Up to 8 guests
  - **Deluxe Suite:** 320 m² | 3 Bedrooms (King + 2 Queen beds, en-suite, large veranda) | Up to 6 guests
- **Balanced 12-Column Layout:** Responsive suite cards on the `/rooms` page with controlled photo heights (`max-h-[500px]`, `aspect-[16/10]`) so suites fit within standard viewports at 100% zoom without requiring browser zoom-out.
- **Multi-Image Slideshows:** Each suite listing includes an interactive photo carousel with automatic transitions and navigation buttons.
- **Dynamic Suite Reordering:** Admins can change the display order of suites on both the Home and Suites pages with one-click Up/Down arrows or direct numeric input in the admin panel.

### 🛡️ 503 Error Prevention Architecture
- **Graceful Shutdown Interceptors:** Intercepts `SIGTERM` and `SIGINT` signals from cPanel CloudLinux Passenger to cleanly unmount connections and close database handles.
- **Automatic Lock Recovery:** Detects and clears stale lock files (`postmaster.pid`) on server boot, completely eliminating database locking issues during server idle spin-downs.

### 💼 Admin Management Panel (`/admin`)
- **Suite Management:** Full CRUD (Create, Read, Update, Delete) for hotel suites with live image uploading and preview.
- **Gallery Manager:** Upload, caption, and reorder photos in the hotel gallery.
- **Reservations & Inquiries:** Review booking requests, approve or decline reservations, and inspect guest contact messages.
- **Site Settings CMS:** Live configuration of hero titles, banner images, contact numbers, email addresses, and SMTP configuration without modifying code.

---

## 3. How to Run Locally

### Start Local Development Server:
```bash
# In your project folder: A:\Development\Projects\Kora_apartment
npm run dev
```

- **Local Website:** [http://localhost:5001](http://localhost:5001)
- **Suites Listing:** [http://localhost:5001/rooms](http://localhost:5001/rooms)
- **Admin Panel:** [http://localhost:5001/admin](http://localhost:5001/admin)

### Build for Production:
```bash
npm run build
```
This compiles the backend into `dist/index.js` and frontend assets into `dist/public/`.

---

## 4. How to Deploy to cPanel

The production deployment package is pre-built and packaged at:
**`A:\Development\Projects\Kora_apartment\cpanel_update_final.zip`**

### Steps to Update an Existing Deployment:
1. Log in to your **cPanel File Manager**.
2. Navigate to your app folder (e.g. `Kora_apartment`).
3. Upload `cpanel_update_final.zip`.
4. Right-click the zip and click **Extract** (overwrite existing files).
5. Delete `cpanel_update_final.zip`.
6. Go to **Setup Node.js App** in cPanel and click **Restart**.
7. Done!

> [!NOTE]
> **Data Safety:** Uploading the zip replaces code files only (`dist/`, `server/`, `shared/`). It does **not** touch or erase your database in `db-storage/` or uploaded images in `uploads/`.

---

## 5. How to Reorder Suites

1. Open the Admin Panel: [http://localhost:5001/admin](http://localhost:5001/admin) (or `/admin` on production).
2. Go to the **Rooms** tab.
3. Look at the **Order** column:
   - Click the **▲ (Up)** button to move a suite higher in the display order.
   - Click the **▼ (Down)** button to move a suite lower in the display order.
   - Alternatively, click the **Edit (Pencil)** icon and enter the desired number in the **Display Order** field (e.g. `1`, `2`, `3`, `4`), then click **Update Room**.
4. Both the **Suites page (`/rooms`)** and the **Home page** immediately update to reflect the new order.

---

## 6. Project Architecture & Key Files

| File / Folder | Purpose |
|---|---|
| `cpanel_update_final.zip` | The final deployment zip ready for cPanel |
| `client/src/pages/Rooms.tsx` | Public Suites page with cinematic hero and suite listing |
| `client/src/components/RoomCard.tsx` | Suite card component with 12-column responsive layout and slideshow |
| `client/src/pages/admin-page.tsx` | Admin panel with reordering controls, suite management, gallery, settings |
| `server/index.ts` | Express server entry point with graceful shutdown & migration checks |
| `server/db.ts` | PGlite/Postgres connection manager with lock file recovery |
| `server/routes.ts` | REST API endpoints for rooms, images, bookings, and inquiries |
| `server/storage.ts` | Database abstraction layer with sorted room queries (`orderBy sort_order`) |
| `shared/schema.ts` | Drizzle ORM table definitions and shared Zod validation schemas |
| `CPANEL_DEPLOYMENT.md` | Detailed cPanel setup and deployment instructions |
| `system-walkthrough.md` | In-depth architectural documentation |
| `ADR-0001-pglite-lock-management.md` | Architecture Decision Record for lock file and 503 fix |

---

## 7. Handover Checklist & Verification

- [x] All 4 suite descriptions, sizes, bedrooms, and amenities verified against client specifications
- [x] Suite card photo sizes proportioned for 100% zoom on all monitor sizes
- [x] One-click suite reordering added to admin panel
- [x] 503 error resolution verified via graceful shutdown and startup lock cleanup
- [x] Production build tested and verified (`npm run build` exits code 0)
- [x] Fresh deployment package created (`cpanel_update_final.zip`)
- [x] All documentation updated (`CPANEL_DEPLOYMENT.md`, `system-walkthrough.md`, `ADR-0001`, `HANDOVER.md`)
