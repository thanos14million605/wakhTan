# wakhTan — Real-Time Chat Application

WakhTan is a full-stack, real-time chat application built with **Node.js**, **Express**, **MongoDB**, **React**, and **Socket.IO**.  
It enables users to send and receive messages instantly, view online statuses, manage their profiles, and enjoy a seamless chat experience with message caching and synchronization.

---

## Features

### Authentication & Authorization

- Secure **JWT-based authentication** (access + refresh tokens)
- **Role-based route protection** using middleware
- Persistent login via HttpOnly cookies

### Real-Time Messaging

- **Socket.IO** for instant message delivery and updates
- Live “online users” tracking and presence updates
- Automatic UI refresh when new messages arrive

### Data Fetching & Caching

- **React Query** for fetching, caching, and synchronizing messages
- Automatic query invalidation when new messages are sent or received
- Optimistic updates for smoother UX

### Message Management

- Full **CRUD operations** for messages:
  - Create and send text or image messages
  - Soft delete messages with timestamp tracking
  - Update messages (optional)
  - Fetch all past messages with pagination
- Cloudinary integration for image message uploads

### Online Status & Live Updates

- Real-time online/offline user list powered by **Socket.IO**
- Dynamic “online” badges for active users
- Auto removal of disconnected users

### User & Profile Management

- Signup, login, and logout
- Profile image management (Cloudinary)
- Edit user details

### Pages

- **Login / Signup:** Secure user access
- **Home:** Chat list, message window, and online status
- **Profile:** Manage user info and profile picture

---

## Tech Stack

### **Frontend**

- React + Vite
- Socket.IO Client
- React Query (TanStack Query)
- Zustand for global state management
- Tailwind CSS
- Audio notifications for new messages

### **Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary for image storage
- Socket.IO Server for real-time communication

---
