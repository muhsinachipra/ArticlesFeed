# Article Feeds Web Application

## Overview

This is a full-stack web application that allows users to register, log in, and view personalized article feeds based on their preferences. Users can create, edit, and manage their articles, as well as adjust their preferences. The application is built using React, Node.js, Express.js, and MongoDB.

## Features

- User registration and authentication using JWT.
- Personalized article feeds based on user preferences.
- Article creation, editing, and management.
- Responsive and interactive user interface with Tailwind CSS.
- Protected routes to ensure that only authenticated users can access certain pages.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Vercel (Frontend), Render/Heroku (Backend)

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/muhsinachipra/ArticlesFeed.git
cd article-feeds-app
```

### 2. Backend Setup

#### Install dependencies

```bash
cd backend
npm install
```

#### Create a `.env` file

Create a `.env` file in the `backend` directory and configure the following environment variables:

```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

#### Start the backend server

```bash
npm start
```

The backend server should now be running on `http://localhost:5000`.

### 3. Frontend Setup

#### Install dependencies

```bash
cd frontend
npm install
```

#### Create a `.env` file

Create a `.env` file in the `frontend` directory with the following:

```bash
VITE_API_URL=http://localhost:5000
```

#### Start the frontend server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`.

## Deployment

### 1. Backend Deployment

Deploy your backend to a platform like Render, Heroku, or any other Node.js hosting service.

- Ensure your environment variables are set on the hosting platform (e.g., `MONGO_URI`, `JWT_SECRET`).
- Update the `VITE_API_URL` in your frontend to point to the deployed backend URL.

### 2. Frontend Deployment

Deploy your frontend to Vercel or any other static site hosting service.

- Ensure the environment variable `VITE_API_URL` is set to the deployed backend URL during the build process.

## Testing

### 1. Running Unit Tests

If you've implemented unit tests, you can run them using:

```bash
npm test
```

### 2. Manual Testing

- **Registration/Login**: Ensure users can register, log in, and receive a JWT.
- **Protected Routes**: Verify that non-authenticated users cannot access protected routes.
- **Preferences and Articles**: Test that users can set preferences, and articles are filtered accordingly.

## Usage

### Accessing the Application

1. Register a new user or log in with an existing account.
2. Set your article preferences in the dashboard.
3. View personalized articles on the homepage.
4. Create, edit, or delete your articles from the dashboard.

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is open-source and available under the MIT License.
