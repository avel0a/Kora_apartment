# ADR 0001: PGlite Lock File Management on Windows

## Status
Accepted

## Context
In local development environments (especially Windows), restarting the Node.js dev server abruptly (e.g., via Nodemon/tsx watch) leaves the PGlite `postmaster.pid` lock file orphaned. Upon restart, PGlite throws a `RuntimeError: Aborted()` and refuses to initialize the database because it perceives another process is actively using it.

## Decision
We have added a startup check in `server/db.ts` that checks for the existence of `db-storage/postmaster.pid` before initializing the `PGlite` client. 
If the file exists and we are not in a production cluster, we synchronously attempt to unlink (delete) it using `fs.unlinkSync()`. 
If it fails (due to legitimate OS-level locking because the server is actually running in another terminal), we catch the exception and log a clear error to the developer.

## Consequences
- **Positive**: Dev server auto-restarts no longer permanently break the database connection.
- **Negative**: If two instances of the dev server are started simultaneously, the second instance might clear the lock and corrupt the local in-memory state or fail gracefully. This is deemed an acceptable risk for local development.

*Generated via Senior Architect & Abel Fullstack Builder skills.*
