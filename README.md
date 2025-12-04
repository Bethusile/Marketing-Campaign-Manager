# Workspace Root Scripts

This workspace contains three main services:
- `ar_client` (frontend)
- `marketing_cliet` (frontend)
- `server` (backend)

To simplify development, you can use the following root-level scripts to install dependencies and run all services concurrently.

## Prerequisites
- Node.js and npm installed

## Install All Dependencies

Run this command from the workspace root to install npm packages for all services:

```powershell
npm run install:all
```

## Run All Services Concurrently

Run this command from the workspace root to start all services at once:

```powershell
npm run dev:all
```

---

For more details, see the individual service README files.