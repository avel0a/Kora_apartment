# ADR 0001: PGlite Lock File & Lifecycle Management (503 Prevention)

## Status
Accepted & Enhanced

## Context
When running on cPanel (CloudLinux Passenger), the hosting environment frequently stops idle Node.js application processes via `SIGTERM` to preserve server memory. When users visit the site again, Passenger spawns the process back up.

Under PGlite, abrupt process shutdowns left an orphaned `db-storage/postmaster.pid` lock file on disk. When Passenger attempted to restart the application, PGlite detected the lock file and threw:
```
RuntimeError: Aborted()
[db] Failed to acquire lock on postmaster.pid
```
This resulted in HTTP 503 "Service Unavailable" errors for visitors until the server was manually restarted.

## Decision & Implementation
A dual-layer lifecycle management strategy was implemented:

1. **Graceful Shutdown Interceptors (`server/index.ts` & `server/db.ts`):**
   - The application intercepts both `SIGTERM` and `SIGINT` signals.
   - When received, the HTTP server stops accepting new connections, and the `closeDb()` routine cleanly shuts down the PGlite WASM engine and releases the lock file.

2. **Boot-Time Lock Recovery (`server/db.ts`):**
   - On every application startup, prior to initializing PGlite, the system checks for `db-storage/postmaster.pid`.
   - If an orphaned lock file is found (e.g. from an abrupt server power cut or ungraceful kill), it is automatically removed before PGlite initializes.

3. **Safe Dynamic Schema Migrations (`server/index.ts` & `server/routes.ts`):**
   - Startup hooks execute `ALTER TABLE rooms ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;` and create auxiliary tables if missing.

## Consequences
- **Positive**: 
  - Complete elimination of 503 errors during cPanel Passenger idle spin-down / spin-up cycles.
  - Safe zero-downtime updates and seamless database migrations without data loss.
- **Negative**: None. Lock acquisition is safe and idempotent across single-process hosting environments.
