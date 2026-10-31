# cPanel Deployment Guide: Kora Hotel Suites

This guide explains how to deploy and update the Kora Hotel Suites application on standard cPanel hosting with "Setup Node.js App" (CloudLinux Passenger).

---

## 📦 What is in the Deployment Zip?
The pre-built package **`cpanel_update_final.zip`** is located in your project root:
- `dist/` (Compiled backend server `dist/index.js` and frontend static assets `dist/public/`)
- `migrations/` (Database migration definitions)
- `package.json` & `package-lock.json` (Dependency manifests)
- `server/` & `shared/` (Server modules and schema definitions)

> [!IMPORTANT]
> **Data Safety Guarantee**:
> Uploading this zip **WILL NOT** overwrite or delete your existing bookings, custom gallery photos, or database data.
> The database lives in the `db-storage/` folder on your server, which is completely separate from the code files in the zip.

---

## 🚀 Fast Deployment (Update Existing Website)

If you already have the Node.js application running on cPanel:

1. **Upload & Extract:**
   - In cPanel, open **File Manager**.
   - Navigate to your application directory (e.g., `/home/username/Kora_apartment/`).
   - Upload `cpanel_update_final.zip`.
   - Right-click `cpanel_update_final.zip` and choose **Extract** (select your app directory as destination and overwrite existing files).
   - Delete `cpanel_update_final.zip` from File Manager once extracted.

2. **Restart Application:**
   - In cPanel, open **"Setup Node.js App"**.
   - Click the **Restart** button for your application.

3. **Verify:**
   - Visit your website: `https://yourdomain.com`
   - Visit the Suites page: `https://yourdomain.com/rooms`
   - Visit the Admin panel: `https://yourdomain.com/admin` (Rooms tab shows the new Order column with Up/Down buttons).

---

## 🛠️ Fresh Deployment (First Time Setup)

If you are setting up the website from scratch on a new server or clean directory:

### Step 1: Create Application Directory
1. Open **File Manager** in cPanel.
2. Create a folder named `Kora_apartment` in your home root (sibling to `public_html`, e.g. `/home/username/Kora_apartment`).
3. Upload `cpanel_update_final.zip` into this folder and extract it.

### Step 2: Configure "Setup Node.js App"
1. In cPanel, search for **"Setup Node.js App"**.
2. Click **Create Application**:
   - **Node.js version**: `20.x` or `22.x`
   - **Application mode**: `Production`
   - **Application root**: `Kora_apartment`
   - **Application URL**: Select your domain or subdomain.
   - **Application startup file**: `dist/index.js`
3. Click **Create**.

### Step 3: Install Dependencies
1. In the Node.js application panel, click **Run NPM Install**.
2. Wait for npm install to finish.

### Step 4: Environment Variables
In the "Setup Node.js App" settings page, add the following environment variables:
- `NODE_ENV` = `production`
- `SESSION_SECRET` = `kora_hotel_super_secret_session_key_2026`
- `PORT` = `5000` (or leave default if managed by Passenger)
- `ADMIN_PASSWORD` = (your preferred admin password)

Click **Save**.

### Step 5: Start & Automatic Database Seeding
1. Click **Restart** or **Start**.
2. When the application starts for the first time, it automatically:
   - Initializes the local PostgreSQL-compatible database in `db-storage/`.
   - Seeds the 4 luxury suites (Junior, Senior, Penthouse, Deluxe) with accurate descriptions, sizes, amenities, and default display orders (`#1`, `#2`, `#3`, `#4`).
   - Seeds default site settings and gallery images.

---

## 🛡️ 503 Prevention Architecture

Previous versions of the deployment could encounter `503 Service Unavailable` errors during cPanel idle restarts. This has been permanently resolved:
1. **Graceful Shutdown (`SIGTERM` & `SIGINT`):** When Passenger spins down the idle Node.js process, the server cleanly unmounts the HTTP listeners and flushes/closes the PGlite database connection.
2. **Auto-Recovery on Startup:** The server checks for any orphaned `db-storage/postmaster.pid` lock files on boot. If one exists, it is automatically purged before initializing the database.

---

## ⚙️ URL Routing & Rewrites (.htaccess)

If refreshing client-side routes (e.g. `/rooms`, `/about`, `/admin`) gives a 404, ensure your document root `.htaccess` (inside the folder where your domain points, e.g. `public_html`) forwards requests to the Node app:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:5000/$1 [P,L]
```
*(Note: Passenger usually creates its own passenger rewrite rules automatically).*
