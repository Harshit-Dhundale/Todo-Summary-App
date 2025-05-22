# Todo Summary App

A full-stack "to-do" application that lets you create, view, edit, and delete tasks, then generate an AI-powered summary of all pending items—displayed right in the UI and posted to a Slack channel. Built with React, Express.js, Supabase, Google Gemini (free-tier model `gemini-2.0-flash`), and Slack Incoming Webhooks.

## 🎥 Demo Video  
[![Watch the demo](https://img.youtube.com/vi/pWSzmL0kwH0/maxresdefault.jpg)](https://youtu.be/pWSzmL0kwH0)

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the repo](#clone-the-repo)
  - [Configure environment variables](#configure-environment-variables)
  - [Installation](#installation)
- [Supabase Setup](#supabase-setup)
- [Slack Webhook Setup](#slack-webhook-setup)
- [Gemini API Key Setup](#gemini-api-key-setup)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Design Notes](#design-notes)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- **CRUD Todos**: Create, view, edit, and delete personal to-do items.
- **Detail View**: Click into a task to see its full details.
- **AI Summaries**: Summarize all pending tasks using Google Gemini's free-tier model `gemini-2.0-flash`.
- **Slack Integration**: Post the generated summary to a Slack channel via Incoming Webhook.
- **On-Site Display**: See the AI summary right in the app UI.
- **Responsive & Trendy UI**: Modern, mobile-friendly design powered by Tailwind CSS.

---

## Prerequisites

- **Node.js** ≥ 16
- **npm** or **yarn**
- **Supabase** account (free tier)
- **Slack** workspace with Incoming Webhooks enabled
- **Google AI Studio** account with a free Gemini API key

---

## Getting Started

### Clone the repo

```bash
git clone https://github.com/<Harshit-Dhundale>/Todo-Summary-App.git
cd todo-summary-app
```

### Configure environment variables

1. In the `backend/` folder, copy `.env.example` to `.env`.
2. Fill in your credentials:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_or_service_key
GEMINI_API_KEY=your_gemini_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url
PORT=3001
```

### Installation

Install dependencies for both frontend and backend:

```bash
# Frontend
cd frontend
npm install

# Backend (in a separate terminal)
cd ../backend
npm install
```

---

## Supabase Setup

1. Log in to Supabase and create a new project.
2. Go to SQL Editor and run:

```sql
create table todos (
  id serial primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);
```

3. Copy your API URL and anon key into `SUPABASE_URL` and `SUPABASE_KEY`.

---

## Slack Webhook Setup

1. In your Slack workspace, go to Apps & Integrations.
2. Create a new Slack App (or select an existing one).
3. Enable Incoming Webhooks and add a new webhook to your target channel.
4. Copy the webhook URL into `SLACK_WEBHOOK_URL`.

---

## Gemini API Key Setup

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Create or select a project, then go to APIs & Services → Credentials.
3. Generate an API key and copy it into `GEMINI_API_KEY`.
4. Model: Use the free-tier `models/gemini-2.0-flash` via the `generateContent(...)` method.

---

## Running the Application

### Development Mode

```bash
# Start backend
cd backend
npm run dev

# In a second terminal, start frontend
cd ../frontend
npm run dev
```

Open your browser at `http://localhost:3000`.

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Serve backend
cd ../backend
npm start
```

---

## Project Structure

```
todo-summary-app/
├── frontend/                # React frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoList.js      # List, add, delete, edit todos
│   │   │   ├── TodoDetail.js    # Detail view for a single todo
│   │   │   ├── EditTodo.js      # Inline edit form
│   │   │   ├── SummarizeButton.js  # Trigger LLM summarization
│   │   │   └── SummaryDisplay.js   # Show summary card
│   │   ├── App.js             # Routes and main layout
│   │   └── index.js           # Entry point
│   └── package.json
└── backend/                 # Express backend
    ├── server.js            # Express server and API routes
    ├── .env.example         # Sample environment variables
    ├── package.json
```

---

## API Endpoints

- `GET  /api/todos`         — Fetch all todos
- `GET  /api/todos/:id`     — Fetch one todo
- `POST /api/todos`         — Create a new todo
- `PUT  /api/todos/:id`     — Update a todo
- `DELETE /api/todos/:id`   — Delete a todo
- `POST /api/summarize`     — Summarize pending todos & post to Slack

---

## Design Notes

- **Frontend**: React functional components, React Router, React Query (or hooks), Tailwind CSS for styling, react-toastify for notifications.
- **Backend**: Express.js with CORS & JSON middleware, Supabase JS client for DB operations, @google/generative-ai for LLM calls (using models/gemini-2.0-flash), axios for Slack webhook posts.
- **Architecture**: Simple client-server REST API, no authentication (future improvement).

---

## Future Improvements

- Add user authentication & multi-user support
- Schedule automatic daily/weekly summaries
- Add due dates, priorities, and filters
- Implement unit & integration tests
- Deploy to Vercel/Netlify (frontend) and Heroku/Supabase Edge Functions (backend)

---

## License

Distributed under the MIT License. See `LICENSE` for details.
```