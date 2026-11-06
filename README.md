# Task Manager Dashboard (MERN)

A full stack task management app built with MongoDB, Express, React and Node.js.
Users can add, edit and delete tasks, toggle their status, and track progress with a progress bar.

## Features
- Add, view, edit and delete tasks (full CRUD)
- Priority levels (Low / Medium / High) and due dates
- Status toggle (Pending / Done)
- Progress bar showing percentage of completed tasks
- React Router navigation and Material UI interface

## Tech Stack
- Frontend: React (Vite), React Router, Material UI, Axios
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB Atlas

## Live Demo
Hosted link: (add after deployment)

## Run locally
1. Clone the repo.
2. Backend: `cd server`, copy `.env.example` to `.env` and add your MongoDB URI, then `npm install` and `npm run dev`.
3. Frontend: `cd frontend`, copy `.env.example` to `.env`, then `npm install` and `npm run dev`.
4. Open http://localhost:5173

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get one task |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| PATCH | /api/tasks/:id/status | Toggle status |
| DELETE | /api/tasks/:id | Delete a task |