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
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/4706eb09-4889-4198-ae3a-c242444b1d5b" />
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/86a4f57b-5d4e-47a1-bf52-1c24c0888555" />
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/57b7226d-bae7-4a9b-b214-f1aea904af18" />




---

## Live Demo

Frontend:
(https://chat-flow-frontend-six.vercel.app)

Backend API:
(https://chatflow-backend-h4rb.onrender.com)

---

## 👨‍💻 Author

Yash Shukla
