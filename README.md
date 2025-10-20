## ATSmooth (Docu-Fix Studio)

### 🎯 Project Idea

ATSmooth is a web application designed to help users create and optimize their CVs (Curriculum Vitae) to be compatible with Applicant Tracking Systems (ATS). The application allows users to either upload an existing CV for analysis and improvement or manually input their data to build a new one from scratch. The app leverages AI to generate optimized and professionally structured content.

The core idea is to streamline the CV creation process, making it easier for job seekers to create professional, ATS-friendly resumes that increase their chances of landing interviews.

### ✨ Key Features

CV Creation: Users can fill out a comprehensive form including personal information, work experience, education, skills, and certifications.

Upload Existing CV: Users can upload their CV file (PDF, DOCX) to be automatically parsed and have its data extracted.

AI-Powered Optimization: The app uses advanced AI language models to refine the wording of job descriptions and experiences, making them more impactful and ATS-compliant.

Live Preview: A real-time preview of the CV is displayed as the user enters or modifies their data.

Save Progress: Users can save their work and return later to complete their CV.

CV Export: The final CV can be generated and exported in both PDF and Google Doc formats.

Secure Authentication: A secure user registration and login system to save user data and CVs safely.

### 🛠️ Tech Stack

Frontend
Framework: React

Language: TypeScript

Build Tool: Vite

Styling: Tailwind CSS

UI Components: shadcn/ui

Form Management: React Hook Form

Schema Validation: Zod

Routing: React Router DOM

State Management: React Context API, useState, and custom hooks (useCV).

API Calls: fetch API

Backend & Database
Backend as a Service (BaaS): Supabase

Database: Supabase Postgres.

Authentication: Supabase Auth.

Storage: Supabase Storage (for CV uploads and generated files).

Workflow Automation: n8n.io

Receives data from the frontend via a Webhook.

Parses uploaded CVs (OCR/Parsing).

Uses AI (Gemini 2.5 Flash) to generate CV content.

Creates Google Docs and PDF files.

Updates the database with the results and generated files.

📂 Project Structure
/
├── public/ # Public assets (favicon, etc.)
├── src/
│ ├── components/ # React components (UI and App-specific)
│ │ ├── app/ # Components for the main app page (Form, Upload, Preview)
│ │ ├── landing/ # Components for the landing page
│ │ └── ui/ # shadcn/ui components
│ ├── contexts/ # React Contexts (e.g., AuthContext)
│ ├── hooks/ # Custom Hooks (e.g., useCV)
│ ├── integrations/ # Service integrations (Supabase)
│ ├── lib/ # Utilities and validators (utils, validators)
│ ├── pages/ # Application pages (CVApp, Auth, Index)
│ ├── types/ # TypeScript definitions (CV data, database types)
│ └── App.tsx # Main app component and routing setup
├── supabase/ # Supabase configuration and migrations
│ └── migrations/ # SQL migration files for database schema
├── .gitignore # Files to be ignored by Git
├── N8N_WORKFLOW.md # Detailed documentation for the n8n workflow
├── package.json # Project definition and dependencies
└── vite.config.ts # Vite configuration

### 🚀 Getting Started

Clone the repository:

Bash

git clone <repository-url>
cd <repository-name>
Install dependencies:

Bash

npm install

# or

yarn install

# or

bun install
Set up environment variables: Create a .env file in the project root and add your Supabase and n8n credentials:

Code snippet

VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_N8N_WEBHOOK_URL=YOUR_N8N_WEBHOOK_URL
Set up the Supabase database:

Run the migration file located in supabase/migrations to create the necessary tables, policies, and storage buckets.

Ensure that Row Level Security (RLS) is enabled on all tables as defined in the SQL file.

Run the development server:

Bash

npm run dev
Open http://localhost:5173 in your browser.

### 📜 Available Scripts

npm run dev: Starts the development server.

npm run build: Builds the app for production.

npm run lint: Lints the code using ESLint.

npm run preview: Previews the production build locally.
