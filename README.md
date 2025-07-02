[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19876512&assignment_repo_type=AssignmentRepo)
# MERN Stack Integration Assignment

This assignment focuses on building a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that demonstrates seamless integration between front-end and back-end components.

## Assignment Overview

You will build a blog application with the following features:
1. RESTful API with Express.js and MongoDB
2. React front-end with component architecture
3. Full CRUD functionality for blog posts
4. User authentication and authorization
5. Advanced features like image uploads and comments

## Project Structure

```
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week4-Assignment.md` file
4. Complete the tasks outlined in the assignment

## Files Included

- `Week4-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Configuration files
  - Sample models and components

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Git

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

For full API details and request/response examples, see [DOCUMENTATION.md](./DOCUMENTATION.md).

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

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement all required API endpoints
3. Create the necessary React components and hooks
4. Document your API and setup process in the README.md
5. Include screenshots of your working application

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)