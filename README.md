# WebAR Marketing Application

This is a monorepo containing the Marketing Client, Server, and AR Client.

## Project Structure

- **marketing-client**: Admin Dashboard (Vite + Vanilla TS + Bulma)
- **server**: Backend API (Node.js + Express + TS + PostgreSQL)
- **ar-client**: AR Observer App (Vite + Vanilla TS + MindAR)

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL (Ensure your database is running and credentials match `server/.env`)

### Installation

1. Clone the repository.
2. Run the setup script to install all dependencies for all services:

```bash
npm run setup
```

### Database Setup

1. Create a `.env` file in the `server` directory based on `server/.env.example` and update your database credentials.
2. Navigate to the server directory: `cd server`
3. Create the database:
   ```bash
   npm run db:create
   ```
4. Create a migration from `database.sql` (if needed):
   ```bash
   npm run migrate:create
   ```
5. Run migrations:
   ```bash
   npm run migrate:run
   ```

### Running the Application

To start all three services simultaneously:

```bash
npm run dev
```

## Tech Stack

### Marketing Client (Admin Dashboard)
- **Framework**: Vite (Vanilla TypeScript)
- **Styling**: Bulma CSS Framework
- **HTTP Client**: Axios

### Server (Backend API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM/Driver**: `pg` (node-postgres)
- **Migration Tool**: Custom Node.js scripts

### AR Client (Observer App)
- **Framework**: Vite (Vanilla TypeScript)
- **AR Engine**: MindAR (Image Tracking)
- **3D Engine**: A-Frame
- **Styling**: Bulma CSS
- **HTTP Client**: Axios
