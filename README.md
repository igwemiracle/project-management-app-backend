# 🧩 Project Management App (Trello Clone)

A full-stack **Project Management Platform** built with **Node.js, Express, MongoDB**, and **JWT authentication**.  
It allows users to manage **Workspaces, Boards, Lists, Cards, and Comments**, collaborate in teams, and track activities.

---

## 🚀 Features

### 👤 Authentication

- User **Signup / Login** with JWT-based authentication.
- Passwords hashed for security.
- Auth middleware to protect routes and identify current users.

### 🧱 Workspace Management

- Users can **create workspaces** to organize their projects.
- The creator automatically becomes the **admin** of the workspace.
- Admins can:
  - Add or remove members.
  - Delete workspaces.
- Role-based access:
  - `admin` → Full control.
  - `member` → Can collaborate within boards.
  - `viewer` → Read-only access.

### 📋 Boards, Lists, and Cards

- **Board**: Represents a project area (e.g., “Marketing Campaign”).
- **List**: Organizes cards (e.g., “To Do”, “In Progress”, “Done”).
- **Card**: Represents individual tasks (with title, description, and comments).
- Boards contain multiple Lists, and each List contains multiple Cards.

### 💬 Comments

- Users can comment on Cards to discuss specific tasks.
- Each comment is linked to a User and a Card.

### 🧑‍🤝‍🧑 Team Collaboration (in progress)

- Workspaces can contain multiple members.
- Each member can have a role (`admin`, `member`, `viewer`).
- Admins can manage roles and permissions.

### 🕓 Activity Tracking (in progress)

- **ActivityLog model** will track user actions like:
  - Creating a Board or List.
  - Adding or removing Cards.
  - Updating a Card’s status.
- Helps track project progress and accountability.

---

## 🧠 Tech Stack

**Backend**

- Node.js
- Express.js
- MongoDB (Mongoose ODM)

**Authentication**

- JSON Web Tokens (JWT)
- bcrypt (for password hashing)
