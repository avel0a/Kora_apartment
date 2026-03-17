# cPanel Deployment Guide: Momona Hotel

This guide explains how to deploy your Node.js application to a standard cPanel hosting environment.

## Prerequisites

- cPanel access with the **"Setup Node.js App"** feature enabled.
- A registered domain or subdomain.
- Your project files (you can upload a ZIP or use Git).

## ⚠️ CRITICAL: Local vs. Server

- **Your Computer**: Run `npm run build` and `npm run check` here.
- **cPanel Server**: **NEVER** run `npm run build`, `npm run dev`, or `npm run check` here. These will fail with "command not found" because the server only has the tools to _run_ the site, not _build_ it.

---

## Step 1: Prepare the Project Locally

Before uploading, you need to generate the production build **on your own computer**.

1.  Open your terminal in the project root.
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  This will create a `dist` folder. This folder contains the compiled backend (`dist/index.js`) and the frontend assets (`dist/public`).

---

## Step 2: Upload Files to cPanel

1.  Log in to cPanel and open **File Manager**.
2.  Create a folder for your app (e.g., `/home/username/momonahotel`). **Caution**: Do not use `public_html` as the application root; it should be a sibling to `public_html`.
3.  Upload the following files and folders:
    - `dist/`
    - `migrations/`
    - `package.json`
    - `package-lock.json`
    - `.env` (Create this on the server with your production secrets)
4.  **Important**: You do **not** need to upload `node_modules`, `client/`, or `server/` (except `dist/`).

---

## Step 3: Setup Node.js App in cPanel

1.  In cPanel, search for **"Setup Node.js App"**.
2.  Click **Create Application**.
3.  **Node.js version**: Select the latest stable version (at least 20.x).
4.  **Application mode**: Select `Production`.
5.  **Application root**: Enter the path where you uploaded your files (e.g., `momonahotel`).
6.  **Application URL**: Choose your domain.
7.  **Application startup file**: Enter `dist/index.js`.
8.  Click **Create**.

---

## Step 4: Install Dependencies

1.  Once the app is created, you will see a button labeled **"Run npm install"**. Click it.
2.  Wait for the process to finish. This installs the required packages on your server.

---

## Step 5: Configure Environment Variables

In the same "Setup Node.js App" interface:

1.  Add a variable named `NODE_ENV` with value `production`. **(Very Important)**
2.  Add `SESSION_SECRET` with a long random string.
3.  Add `PORT` (usually cPanel handles this, but you can set it to `5000` if needed).
4.  Click **Save**.

---

## Step 6: Fix Routing (.htaccess)

If your website shows a 404 when you refresh page like `/rooms`, you need to ensure all traffic points to your Node.js app. cPanel usually handles this, but if not, ensure your `.htaccess` in the domain's document root (e.g., `public_html` if that's where the domain points) looks like this:

```apache
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:PORT/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:PORT/$1 [P,L]
```

_(Note: Replace `PORT` with the actual port your app is running on, which you can find in the node app settings)._

---

## Step 7: Database & Uploads

- **Database**: The app uses **PGlite**, which stores data in a local folder `.drizzle/pglite`. The server will automatically create this and run migrations on first start.
- **Uploads**: Images will be stored in the `uploads` folder in your application root. Ensure this folder is writable.

---

## Troubleshooting

- **"sh: cross-env: command not found" error**: I have removed `cross-env` from the `start` script in `package.json`. Ensure you upload the updated `package.json` to the server. You **must** also set `NODE_ENV` to `production` manually in the cPanel Node.js Selector settings (see Step 5).
- **"Can't acquire lock for app" error**: This happens when a previous operation was interrupted and left a lock file behind.
  1. Go to cPanel **File Manager**.
  2. Navigate to your application root (e.g., `momonahotel`).
  3. Look for a file named `.lock` or similar. Sometimes it is hidden, so click **Settings** (top right) and check **"Show Hidden Files"**.
  4. If it's not in your app folder, it might be in `/home/username/nodevenv/repositories/your_app_name/`.
  5. Delete the `.lock` file.
  6. **Stop** the application in the "Setup Node.js App" interface, then try **Run npm install** again.
- **Logs**: Check the `stderr.log` file in your application root if the app fails to start.
- **Port**: If the app doesn't load, check the port assigned by cPanel in the "Setup Node.js App" screen.
