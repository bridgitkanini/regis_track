# RegisTrack

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#-project-structure)
5. [Data Models](#data-models)
6. [API Services](#api-services)
7. [Error Handling](#error-handling)
8. [State Management](#state-management)
9. [User Interface](#user-interface)
10. [Component Architecture](#component-architecture)
11. [Development Practices](#development-practices)
12. [Installation & Setup](#-installation--setup)
13. [Usage Guide](#-usage-guide)

## Project Overview

RegisTrack is a comprehensive member registration and activity tracking system designed to streamline member management for organizations. The application provides a modern, responsive interface built with React and TypeScript, powered by a robust Node.js/Express backend with MongoDB as the database.


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
- **Member Management**: Create, view, update, and delete member records with detailed profiles
- **Activity Tracking**: Monitor and log all member activities and system events
- **User Authentication**: Secure login and role-based access control (RBAC)
- **Dashboard Analytics**: Visualize member statistics and activity trends
- **Responsive Design**: Fully responsive interface that works on all devices
- **API-First Architecture**: RESTful API for easy integration with other systems
- **Activity Logging**: Comprehensive audit trail of all system activities
- **Search & Filtering**: Advanced search and filtering capabilities for members and activities


## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit & React Query
- **UI Components**: Headless UI with custom Tailwind CSS components
- **Form Handling**: React Hook Form with Yup validation
- **Routing**: React Router v7
- **Testing**: Jest & Playwright

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Custom activity logger middleware
- **Validation**: Express Validator

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier
- **Version Control**: Git with GitHub
- **CI/CD**: GitHub Actions (configurable)

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


## Data Models

### User
- Authentication details (email, hashed password)
- Role-based access control
- Profile information
- Timestamps for creation and updates

### Member
- Personal information (name, contact details)
- Membership status and type
- Associated activities and events
- Profile photo storage
- Custom fields and metadata

### Activity Log
- Action type and description
- Associated user and member
- Timestamp and IP address
- Request and response data
- Status and error information

## API Services

### Authentication
- User registration and login
- JWT token management
- Password reset functionality
- Role-based access control

### Members
- CRUD operations for member profiles
- Bulk import/export
- Advanced search and filtering
- Photo upload and management

### Dashboard
- Member statistics and analytics
- Activity feed and audit logs
- System health and usage metrics

### Admin
- User management
- System configuration
- Data backup and restore

## Error Handling

- **Client-Side**: Custom error boundaries and toast notifications
- **Server-Side**: Centralized error handling middleware
- **Validation**: Request validation with meaningful error messages
- **Logging**: Detailed error logging for debugging
- **Monitoring**: Integration with monitoring tools (configurable)

## State Management

- **Global State**: Redux Toolkit for application-wide state
- **Server State**: React Query for data fetching and caching
- **Local State**: React hooks for component-level state
- **Persistence**: Redux Persist for persisting state across sessions
- **Optimistic Updates**: For better user experience

## User Interface

### Design System

- **Color Scheme**:
  - Primary: `#2879fe` (blue) - Main brand color
  - Text: `#333` - Main text color
  - Light Text: `#777` - Secondary text
  - Border: `#e0e0e0` - Border color
  - Background: `#f5f5f5` - Light background
  - Error: `#ff4d4f` - Error/validation
  - Success: `#52c41a` - Success messages

### Core Components

1. **Navbar**
   - Responsive navigation with mobile menu
   - User profile and notifications
   - Quick access to important features

2. **Sidebar**
   - Main navigation menu
   - Collapsible sections
   - Role-based menu items

3. **Data Tables**
   - Sortable and filterable
   - Pagination support
   - Row actions and bulk operations

4. **Forms**
   - Form validation
   - Field types for all data needs
   - Responsive layout

5. **Modals & Dialogs**
   - Confirmation dialogs
   - Form modals
   - Responsive behavior

## Component Architecture

### Page Components

1. **Dashboard** (`/`)
   - Overview of key metrics
   - Recent activities
   - Quick actions

2. **Members** (`/members`)
   - Member directory
   - Advanced search and filtering
   - Bulk operations

3. **Member Detail** (`/members/:id`)
   - Complete member profile
   - Activity history
   - Related records

4. **Settings** (`/settings`)
   - User preferences
   - System configuration
   - Data management

### Shared Components

- **Layout**: Page templates and containers
- **UI Elements**: Buttons, inputs, modals, etc.
- **Data Display**: Cards, tables, lists
- **Feedback**: Loaders, toasts, error states
- **Navigation**: Breadcrumbs, pagination, tabs

## Development Practices

### Code Organization
- **Feature-based Structure**: Components grouped by feature
- **Shared Components**: Reusable UI elements
- **Type Definitions**: TypeScript interfaces and types
- **API Services**: Centralized API calls
- **Hooks**: Custom hooks for reusable logic

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Modules**: For component-scoped styles
- **Design Tokens**: Consistent spacing, colors, and typography
- **Responsive Design**: Mobile-first approach

### Testing Strategy
- **Unit Tests**: Jest for component and utility testing
- **Integration Tests**: Component interactions
- **E2E Tests**: Playwright for user flows
- **Snapshot Testing**: For UI consistency


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

   - API documentation: `http://localhost:3000/swagger`

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

1. Access the interactive API documentation at `http://localhost:3000/swagger` when the backend is running
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

- API documentation is available at `/swagger` when the backend is running
- Component documentation is available in the source code using JSDoc

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) for details.
