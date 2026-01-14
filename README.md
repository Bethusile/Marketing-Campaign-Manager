ARM Workspace
This repository contains the full stack implementation for the ARM (Augmented Reality Marketing) platform. The project is divided into three main components:

ar_client: The Augmented Reality frontend experience.
marketing_client: The administrative dashboard for managing campaigns and images.
server: The backend API and database management.
Project Overview & Methodology
The ARM platform allows for the creation of AR marketing campaigns where physical images (targets) trigger digital overlays and interactive content on a user's mobile device.

Core Logic
The AR system is designed with two main goals: to separate the tracking data from the visual content, and to allow images to be reused across multiple campaigns (a many-to-many relationship).

Image Management:

Images are uploaded to the server in pairs: Redacted and Unredacted.
These images are saved in the database and file system.
Redacted images are used to generate the tracking data.
Unredacted images are the high-quality visuals overlaid in the AR experience.
Campaign Creation:

When a campaign is created, it selects a set of images to be tracked.
The progrem uses the redacted images to generate a .mind file. This file contains the feature points required for the computer vision algorithm to track multiple images simultaneously.
The .mind file is compiled client-side and stored server-side.
A Map is created to link the index of the image in the .mind file (0, 1, 2...) to the actual database ID of the image.
Data Relationships:

There are two main models: CampaignImages and Campaign.
The relationship is Many-to-Many: One campaign can track multiple images, and one image can be used across multiple campaigns.
Each campaign has its own unique metadata, such as a display message and a call-to-action button link.
AR Client Execution:

A campaign is identified by a unique 3-character ID passed as a query parameter in the URL (e.g., scanned via QR code).
The ar_client fetches this ID from the URL and requests the campaign details from the server.
The server responds with the campaign info, including the URL to the .mind file and the index-to-image map.
The client initializes the AR session using the .mind file to track the targets.
When an image is tracked, the client uses the Map to identify which image ID corresponds to the tracked target index.
Finally, the client fetches the unredacted image associated with that ID and overlays it on top of the physical target in the AR view.
Tech Stack
AR Client (ar_client)
Framework: Vite + TypeScript
AR Engine: MindAR (Image tracking) and A-Frame (3D rendering).
MindAR: A web-based augmented reality library that runs in the browser. It handles the computer vision tasks of detecting and tracking images from the camera feed.
A-Frame: A web framework for building virtual reality experiences. In this project, it is used to render the 3D scene and overlay the unredacted images onto the tracked targets provided by MindAR.
Marketing Client (marketing_client)
Framework: Vite + React + TypeScript
UI Library: Material UI (MUI)
HTTP Client: Axios
Purpose: Provides a user interface for marketers to upload images, create campaigns, and manage the associations between them.
Server (server)
Runtime: Node.js
Framework: Express.js
Database: PostgreSQL
ORM: Sequelize
Purpose: Handles API requests, manages the database, stores file uploads, and compiles .mind files for tracking.
Getting Started
Prerequisites
Node.js and npm installed
PostgreSQL database running
Installation
To install dependencies for all services, run the following command from the root directory:

npm run install:all
Running the Application
To start all services concurrently (AR client, Marketing client, and Server), run:

npm run dev:all
AR Client: Runs on port 5200 (e.g., http://localhost:5200)
Marketing Client: Runs on default Vite port (usually 5173)
Server: Runs on port 3000 (or as configured)
Additional Notes & Future Roadmap
AR Library & Vendor Scripts: NPM packages are no longer supported for the AR library. They are imported and used as vendor scripts to ensure stability and compatibility.
Testing AR Client: To test the ar_client, append /?id=<campaign_id> to the URL to load a specific campaign (e.g., http://localhost:5200/?id=abc).
Deprecated Folder: The campaign_manager folder was an old prototype used to test campaign uploads. It is NOT part of the final project and can be ignored.
