# Project Directory Structure Guide

This document explains the organization of the codebase to help understand where to add new features and code.

## Root Directory
- **package.json**: Contains scripts to run all services simultaneously (`npm run dev`) and setup scripts.
- **README.md**: General project documentation and setup instructions.

## server/
The backend API that handles data persistence and logic.

- **database.sql**: The "staging area" for new SQL schema changes. Write your new `CREATE` or `ALTER` statements here before generating a migration.
- **migrations/**: Contains timestamped SQL files generated from `database.sql`. **Do not edit these manually**; use the migration scripts.
- **uploads/**: Stores images uploaded by the marketing client.
- **src/**:
    - **controllers/**: Contains the business logic for API endpoints.
        - *Why here?* Keeps route definitions clean. Put the "how" of the request handling here.
    - **routes/**: Defines the API endpoints and maps them to controllers.
        - *Why here?* Central place to see all available API URLs.
    - **scripts/**: Custom Node.js scripts for database management (`createDb`, `migrate`, etc.).
    - **db.ts**: Database connection configuration.
    - **index.ts**: The entry point of the server application.

## marketing-client/
The Admin Dashboard for creating and managing AR campaigns.

- **src/**:
    - **components/**: UI components (Forms, Lists, etc.).
        - *Why here?* Reusable pieces of the UI.
    - **services/**: API integration logic.
        - *Why here?* All `axios` calls to the `server` should go here. This separates UI logic from data fetching logic.
    - **main.ts**: Application entry point.

## ar-client/
The end-user mobile web application for viewing AR content.

- **src/**:
    - **components/**: UI overlays and AR interaction logic.
    - **services/**: API integration logic.
        - *Why here?* Fetches campaign data (like the target image and AR content) from the `server`.
    - **ar-setup.ts**: Configuration for the MindAR and A-Frame scenes.
    - **main.ts**: Application entry point.

---

### Common Patterns

#### Adding a New API Endpoint
1.  **Server**: Define the route in `server/src/routes/`.
2.  **Server**: Implement the logic in `server/src/controllers/`.
3.  **Client**: Add a function in `client/src/services/api.ts` to call the new endpoint.

#### Changing the Database Schema
1.  **Server**: Write the SQL change in `server/database.sql`.
2.  **Server**: Run `npm run migrate:create`.
3.  **Server**: Run `npm run migrate:run`.
