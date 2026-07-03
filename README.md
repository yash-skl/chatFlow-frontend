# ChatFlow

A modern real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io.

---

## Features

- Username-based login
- Real-time messaging using Socket.io
- Online/Offline user status
- Typing indicator
- Message timestamps
- Read & Delivered status
- Persistent chat history using MongoDB
- Clean component-based architecture

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios
- Socket.io Client
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io

---

## Project Structure

ChatFlow
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── socket
│   └── utils
│
└── frontend
    ├── components
    ├── pages
    └── context

---

## Project setup instructions

### 1. Clone the repository

git clone https://github.com/yash-skl/chatFlow-frontend
git clone https://github.com/yash-skl/chatFlow-backend

---

### 2. Backend Setup

cd backend
npm install

Create a `.env` file

PORT=3000

MONGODB_URI=

CORS_ORIGIN=

Run
npm run dev

---

### 3. Frontend Setup

cd frontend
npm install


Run
npm run dev

---

## REST APIs

### User APIs

POST /api/v1/users/login
GET /api/v1/users/users

### Message APIs

POST /api/v1/messages/message
GET /api/v1/messages/messages

---

## Socket Events

### Client → Server

- join
- typing
- stopTyping

### Server → Client

- newMessage
- onlineUsers
- typing
- stopTyping

---

## Design Decisions

- Implemented username-based authentication to keep the assignment simple.
- Used MongoDB for persistent message storage.
- Socket.io is used for real-time communication.
- REST APIs are used for fetching users and chat history.
- Components are separated for better maintainability and reusability.
- Online users are managed in memory using Socket.io.

---

##  Assumptions

- A unique username identifies each user.
- Authentication is intentionally simplified as per the assignment.
- Messages are exchanged between two users only.
- Internet connectivity is assumed for real-time communication.

---

##  Screenshots


---

## Live Demo

Frontend:
(Add Vercel URL)

Backend API:
(Add Render/Railway URL)

---

## 👨‍💻 Author

Yash Shukla
