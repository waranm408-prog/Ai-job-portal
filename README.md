# AI Job Portal

## Project Overview

This repository contains a two-part application for resume analysis and ATS compatibility scoring.

- `backend/` is an Express server that receives a resume upload and job description, extracts text from PDF resumes, compares job keywords with the resume content, and returns an ATS compatibility score.
- `Job/` is a React + TypeScript + Vite frontend that allows users to upload a resume, enter a job description, and view analysis results.

## Key Features

- Resume upload using `multer`
- PDF parsing with `pdf-parse`
- Skill matching between resume content and job description text
- Score calculation, matched/missing skills, and suggestions
- Simple frontend UI built with React, TypeScript, and Tailwind CSS

## Architecture

### Frontend

- React + TypeScript + Vite
- Tailwind CSS for styling
- Uses `fetch` to send a multipart/form-data request to the backend
- Main feature component: `Job/src/assets/user/ResumeAnalyzer.tsx`

### Backend

- Express server in `backend/server.js`
- Endpoint: `POST /api/analyze`
- Parses PDF file buffer from `multer`
- Compares extracted resume content against a fixed skill list
- Returns JSON with a score and suggestions

### Database

- Not currently implemented
- Recommended future architecture: MongoDB with Mongoose or PostgreSQL with Prisma
- Suggested models: `User`, `Resume`, `JobDescription`, `AnalysisResult`

## Setup Instructions

### Backend

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
4. The backend listens on `http://localhost:5000`

### Frontend

1. Open a terminal in `Job/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. The frontend runs on `http://localhost:5173` by default

## Environment Variables

The frontend can use `VITE_API_URL` to override the backend endpoint.

Example `.env` in `Job/`:

```env
VITE_API_URL=http://localhost:5000
```

## Current Limitations

- No persistence or database storage
- No user authentication
- No structured resume/job posting management
- Only PDF resume parsing is supported
- Skill matching is based on a fixed static list

## Recommended Roadmap

### Phase 1: Improve MVP

- Add input validation on frontend and backend
- Add consistent error handling
- Enhance PDF parsing and fallback behavior
- Add support for `.docx` resume files

### Phase 2: Add Authentication & Database

- Add user sign-up/login with JWT or sessions
- Add persistence layer using MongoDB or PostgreSQL
- Create models for users, resumes, jobs, and analysis results
- Add analysis history and resume storage

### Phase 3: Enhance Product Features

- Add job posting CRUD
- Add user dashboard for resume history and job matches
- Add weighting for skill matches and resume section detection
- Improve UI with results history and filtering

### Phase 4: Deployment

- Deploy frontend to Vercel / Netlify
- Deploy backend to Render / Heroku / Cloud Run
- Configure CORS and secure production environment
- Add monitoring and logging

## Suggested Folder Structure

```
backend/
  ├── controllers/
  ├── middleware/
  ├── models/
  ├── routes/
  ├── server.js
  ├── package.json

Job/
  ├── public/
  ├── src/
  │   ├── assets/
  │   │   └── user/ResumeAnalyzer.tsx
  │   ├── components/
  │   └── App.tsx
  ├── package.json
  ├── tsconfig.json
  └── vite.config.ts
```

## Notes

- The backend currently uses an in-memory file upload strategy and does not persist resume files.
- The backend can be extended to store parsed text and analysis metadata once a database is added.
- The frontend currently supports one analysis flow and can be expanded with login, dashboard, and history pages.
