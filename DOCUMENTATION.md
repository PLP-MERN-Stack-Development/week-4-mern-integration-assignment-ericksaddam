# MERN Stack Blog Application Documentation

# Author
Erick Saddam : https://github.com/ericksaddam/ericksaddam

## Table of Contents
- [Project Overview](#project-overview)
- [Features Implemented](#features-implemented)
- [API Documentation](#api-documentation)
- [Setup Instructions](#setup-instructions)
- [Screenshots](#screenshots)
- [Custom Hooks](#custom-hooks)

---

## Project Overview
A full-featured blogging platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application demonstrates modern web development practices with a focus on clean architecture, security, and user experience.

---

## Features Implemented
- User authentication (register, login, protected routes)
- Create, read, update, and delete blog posts
- Rich text editor for post content
- Image upload support
- Categories and tags
- Comments system
- Pagination and search
- Mobile-responsive design
- JWT authentication & password hashing
- Protected routes & input validation
- Error handling
- Modern, responsive UI with loading and error states
- Admin user management (view, add, edit, delete users)
- Admin can edit and delete any user's post or comment

---

## API Documentation

### Authentication Routes
- `POST /api/auth/register` — Register a new user
  - **Request:** `{ username, email, password }`
  - **Response:** `{ user, token }`
- `POST /api/auth/login` — Login user
  - **Request:** `{ email, password }`
  - **Response:** `{ user, token }`
- `GET /api/auth/me` — Get current user (requires Bearer token)
  - **Response:** `{ user }`

### Post Routes
- `GET /api/posts` — Get all posts (pagination: `?page=1&limit=10`)
- `GET /api/posts/:id` — Get single post
- `POST /api/posts` — Create new post (requires auth)
- `PUT /api/posts/:id` — Update post (requires auth)
- `DELETE /api/posts/:id` — Delete post (requires auth)
- `POST /api/posts/:id/comments` — Add comment
- `GET /api/posts/search?q=term` — Search posts

### Category Routes
- `GET /api/categories` — Get all categories
- `POST /api/categories` — Create category (authenticated users)
- `PUT /api/categories/:id` — Update category (authenticated users)
- `DELETE /api/categories/:id` — Delete category (authenticated users)

### User Management (Admin Only)
- `GET /api/users` — List all users
- `POST /api/users` — Create a new user
- `PUT /api/users/:id` — Update user details
- `DELETE /api/users/:id` — Delete a user

---

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/week-4-mern-integration-assignment-ericksaddam.git
   cd week-4-mern-integration-assignment-ericksaddam
   ```
2. Server setup:
   ```bash
   cd server
   npm install
   cp .env.example .env    # Update with your values
   npm run dev
   ```
3. Client setup:
   ```bash
   cd client
   npm install
   cp .env.example .env    # Update with your values
   npm run dev
   ```
4. Create uploads directory:
   ```bash
   mkdir -p server/uploads/posts
   ```

---

## Screenshots
Screenshorts are in the root of the application

---

## Custom Hooks
- The custom hook `useApi` is implemented in `src/hooks/useApi.js` for reusable API calls with loading and error state management.
- Most custom hooks are implemented directly within components or context files. If you wish to reuse hooks, consider moving them to a `src/hooks/` directory for better organization.

---

## Technologies Used
### Frontend
- React.js, React Router, TailwindCSS, Axios, Vite
### Backend
- Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Express Validator
### Dev Tools
- ESLint, Prettier, Nodemon, Git

---

## License
This project is licensed under the MIT License.
