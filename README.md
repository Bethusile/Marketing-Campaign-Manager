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

## How It Works

These commands use scripts defined in the root `package.json` (see below). The `install:all` script installs dependencies for each service. The `dev:all` script uses `concurrently` to run all dev servers in parallel.

## Example Root `package.json` Scripts

Add these scripts to your root `package.json`:

```json
{
  "scripts": {
    "install:all": "npm --prefix ar_client install && npm --prefix marketing_cliet install && npm --prefix server install",
    "dev:all": "npx concurrently \"npm --prefix ar_client run dev\" \"npm --prefix marketing_cliet run dev\" \"npm --prefix server run start\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

> **Note:** You may need to run `npm install concurrently --save-dev` in the root to install the `concurrently` package.

---

For more details, see the individual service README files.