# RegisTrack

[![Nx](https://img.shields.io/nx/r/regis-track)](https://nx.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

RegisTrack is a modern web application for managing member registrations and tracking activities. Built with a React frontend and Node.js/Express backend, it provides a comprehensive solution for member management and activity tracking.

## 🚀 Features

- **Frontend**: Built with React 19, TypeScript, and Vite
- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with Headless UI components
- **Routing**: React Router v7 for client-side navigation
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with validation
- **API Documentation**: Swagger/OpenAPI support
- **Testing**: Jest for unit tests, Playwright for E2E tests
- **Code Quality**: ESLint and Prettier for consistent code style

## 🏗️ Project Structure

```
.
├── apps/
│   ├── app/                      # Frontend React application
│   │   ├── src/
│   │   │   ├── app/                   # App configuration and store
│   │   │   │   └── store.ts           # Redux store configuration
│   │   │   │
│   │   │   ├── components/            # Reusable UI components
│   │   │   │   ├── auth/              # Authentication components
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── RegisterForm.tsx
│   │   │   │   │   └── ProtectedRoute.tsx
│   │   │   │   │
│   │   │   │   ├── common/            # Shared UI components
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── DropdownMenu.tsx
│   │   │   │   │   ├── Loader.tsx
│   │   │   │   │   └── ...
│   │   │   │   │
│   │   │   │   ├── dashboard/         # Dashboard components
│   │   │   │   │   ├── RecentActivity.tsx
│   │   │   │   │   └── StatsGrid.tsx
│   │   │   │   │
│   │   │   │   ├── layout/            # Layout components
│   │   │   │   │   ├── Layout.tsx
│   │   │   │   │   ├── Navbar.tsx
│   │   │   │   │   └── Sidebar.tsx
│   │   │   │   │
│   │   │   │   └── members/           # Member management components
│   │   │   │       ├── MemberDetail.tsx
│   │   │   │       ├── MemberForm.tsx
│   │   │   │       └── MemberTable.tsx
│   │   │   │
│   │   │   ├── contexts/              # React contexts
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   └── ThemeContext.tsx
│   │   │   │
│   │   │   ├── features/              # Feature modules with RTK Query APIs
│   │   │   │   ├── activity/          # Activity tracking
│   │   │   │   ├── auth/              # Authentication
│   │   │   │   ├── members/           # Member management
│   │   │   │   └── ui/                # UI state management
│   │   │   │
│   │   │   ├── layouts/               # Page layouts
│   │   │   │   └── MemberLayout.tsx
│   │   │   │
│   │   │   ├── lib/                   # Library code
│   │   │   │   └── api/               # API client configuration
│   │   │   │
│   │   │   ├── pages/                 # Page components
│   │   │   ├── types/                 # TypeScript type definitions
│   │   │   └── utils/                 # Utility functions
│   │   │
│   │   └── public/                    # Static assets
│   │
│   ├── backend/                 # Backend Express application
│   │   ├── src/
│   │   │   ├── config/         # Configuration files
│   │   │   ├── controllers/     # Request handlers
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── models/         # Database models
│   │   │   ├── routes/         # API routes
│   │   │   └── services/       # Business logic
│   │
│   ├── app-e2e/                # Frontend E2E tests
│   └── backend-e2e/            # Backend E2E tests
```

## 🛠️ Prerequisites

- Node.js (v18 or later recommended)
- pnpm (v8 or later)
- MongoDB (v6 or later) running locally
- Git

## 🚀 Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/regis-track.git
   cd regis-track
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your configuration (MongoDB connection, JWT secret, etc.)

### Running the Application

1. Start MongoDB (if not already running):

   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # Or using Docker
   docker run --name mongodb -p 27017:27017 -d mongo:latest
   ```

2. Start the backend server in development mode:

   ```bash
   npx nx serve backend
   ```

   The backend will be available at `http://localhost:3000` by default.

   - API documentation: `http://localhost:3000/api-docs`

3. In a separate terminal, start the frontend development server:
   ```bash
   npx nx serve app
   ```
   The frontend will be available at `http://localhost:4200` by default.

## 🎯 Usage Guide

### Authentication

1. **Registration**

   - Navigate to the registration page
   - Fill in your details (name, email, password)
   - Submit the form to create a new account

2. **Login**
   - Go to the login page
   - Enter your email and password
   - Click "Sign In" to access your dashboard

### Dashboard

- View an overview of member statistics and recent activities
- Quick access to important features via the sidebar
- Responsive design works on both desktop and mobile devices

### Member Management

1. **View All Members**

   - Navigate to "Members" in the sidebar
   - Browse the list of registered members
   - Use search and filters to find specific members

2. **Add New Member**

   - Click the "Add Member" button
   - Fill in the member details
   - Submit the form to add the member

3. **Edit Member**

   - Click on a member to view details
   - Click the "Edit" button
   - Update the necessary information
   - Save your changes

4. **Delete Member**
   - Locate the member in the list
   - Click the delete icon (🗑️)
   - Confirm the deletion

### User Profile

- Click on your profile picture in the top-right corner
- Select "Profile" to view and edit your account information
- Update your password or personal details as needed

### Settings

- Access application settings from the user menu
- Configure preferences and notification settings
- Manage account security options

## 🔍 API Documentation

For developers integrating with the RegisTrack API:

1. Access the interactive API documentation at `http://localhost:3000/api-docs` when the backend is running
2. The API follows RESTful principles
3. All API endpoints require authentication except for login/registration
4. Include the JWT token in the `Authorization` header for authenticated requests

### Example API Request

```bash
# Get current user profile
curl -X GET 'http://localhost:3000/api/users/me' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'

# Get all members
curl -X GET 'http://localhost:3000/api/members' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests for a specific project
npx nx test app
npx nx test backend
```

### E2E Tests

```bash
# Run frontend E2E tests
npx nx e2e app-e2e

# Run backend E2E tests
npx nx e2e backend-e2e
```

## 🏗️ Build

To build the applications for production:

```bash
# Build both frontend and backend
pnpm build

# Or build individually
npx nx build app
npx nx build backend
```

The production builds will be available in the `dist/` directory of each app.

## 📚 Documentation

- API documentation is available at `/api-docs` when the backend is running
- Component documentation is available in the source code using JSDoc

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) for details.
