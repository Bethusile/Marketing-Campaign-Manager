# Campaign Manager

The Campaign Manager is the internal dashboard for uploading AR marketing campaigns, maintaining their related detection targets, and verifying the responses coming back from the backend API that lives in `/server`. It provides a tightly scoped operator UI that marketers can use to:

- create or update campaign metadata (title, hero message, CTA URL)
- upload asset bundles (target image, overlay artwork, `.mind` files) required by the AR runtime
- add new detection targets compiled by the AR authoring pipeline
- toggle campaign activation flags as soon as QA signs off
- fetch the latest campaign image list for validation
- inspect raw JSON responses returned by the server without leaving the dashboard

Because the client is built with Vite + TypeScript, changes to scripts or styling apply instantly, keeping the iteration loop fast while still letting us ship production-ready bundles.

---

## Directory Overview

```
campaign_manager/
├── index.html                # Hero header + #app mount point + loader markup
├── package.json              # Vite + TypeScript tooling config
├── scripts/
│   └── fetch-vendor.ps1      # Downloads A-Frame + MindAR vendor bundles
├── src/
│   ├── main.ts               # Entry point: wires forms, helpers, loader UX
│   ├── style.css             # Neon dashboard theme, loader, hero animations
│   ├── helpers/
│   │   ├── addTarget.ts      # Target upload helper with file inputs
│   │   ├── campaignStatusHelper.ts  # Toggle `isActive` via API
│   │   ├── getImages.ts      # Fetches campaign image metadata
│   │   └── uploadImagesHelper.ts    # Uploads overlay/target assets
│   └── vendor/               # Local copies of A-Frame & MindAR runtime assets
└── tsconfig.json             # TypeScript compiler options aligned with Vite
```

---

## How the dashboard works

1. **Bootstrapping:** `src/main.ts` injects every operational panel (campaign form, target uploader, image fetcher, activation toggle, response console) into a `.panel-grid` container and keeps the DOM hidden until all components are styled, preventing any flash of unstyled content.
2. **API wiring:** Each panel delegates to a helper (`uploadImagesHelper`, `addTargetHelper`, etc.) that knows which backend endpoint to call. All requests share a base URL derived from `VITE_API_BASE_URL`, defaulting to `http://localhost:3000` during local development so it can talk to the Express server in `/server`.
3. **File handling:** Campaigns and targets support multi-file uploads (images + `.mind` bundles). Inputs feed into `FormData` objects that the helpers post to `POST /api/campaign/upload`, `POST /uploadImages`, or `POST /postTarget` depending on the action.
4. **Status + responses:** Server responses (success or error) stream into the shared `<pre class="resp">` block so operators can copy/paste the raw JSON when verifying deployments or reporting issues.
5. **Vendor assets:** A-Frame and MindAR scripts ship inside `src/vendor`. If updated binaries are needed, run `npm run vendor:fetch` to pull the latest versions via PowerShell.

---

## Prerequisites

- Node.js 20+ (matches the server’s toolchain)
- npm 9+
- PowerShell (only required if you need to run `npm run vendor:fetch`)

---

## Environment variables

Create a `.env` file at the root of `campaign_manager` (or use Vite’s `.env.local`) with the API base URL:

```
VITE_API_BASE_URL=http://localhost:3000
```

> When unset, the client assumes `http://localhost:3000` in dev and relative `/api` paths in production, so setting the variable is optional locally but recommended when hitting staging/production servers.

---

## Installation

```powershell
cd campaign_manager
npm install
```

If you need to refresh the MindAR/A-Frame bundles:

```powershell
npm run vendor:fetch
```

---

## Running the client and server together

You need the Express API from `/server` and this Vite client running at the same time. Use two terminals:

### Terminal 1 – backend API
```powershell
cd server
npm install          # first time only
npm run dev          # launches ts-node on http://localhost:3000
```

### Terminal 2 – campaign manager UI
```powershell
cd campaign_manager
npm install          # first time only
npm run dev          # starts Vite on http://localhost:5173
```

The client will automatically proxy API calls to `http://localhost:3000` using `VITE_API_BASE_URL`. If you change ports, update the env var before restarting Vite.

> Tip: When testing in a single shell, run one command inside `cmd /k` or `PowerShell` split panes so both processes stay alive.

---

## Build & preview

```powershell
npm run build    # type-check + production bundle into dist/
npm run preview  # serves the built assets the same way Vite deploys them
```

Deploy the `dist/` folder behind a static host (Azure Static Web Apps, Netlify, etc.) and point it at the live API base URL via environment variables.

---

## Operational checklist

1. **Upload campaigns:** Fill out title, hero message, CTA URL, and submit. The response panel confirms the payload persisted and returns the assigned campaign ID.
2. **Attach assets:** Use *Upload Images* to push overlay/target art to the server, then map the resulting URLs to campaigns if needed.
3. **Add targets:** Through *Add Target*, upload the detection pack (target image + overlay + `.mind`). The helper wires everything to the `/postTarget` endpoint and echoes the created target ID.
4. **Toggle activation:** Enter a campaign ID, flip the active switch, and click *Toggle*. The UI calls `updateCampaignStatus` so QA or marketing can immediately promote or pause a campaign.
5. **Verify media:** Hit *Load Images* to fetch the latest media list. Inspect the JSON to ensure assets exist before shipping a campaign to production clients.

Following the above keeps campaigns, targets, and assets synchronized between the dashboard and the backend service.
