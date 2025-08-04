# RegisTrack

[![Nx](https://img.shields.io/nx/r/regis-track)](https://nx.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

RegisTrack is a modern web application built with React, TypeScript, and Node.js, using Nx as the build system. The project follows a monorepo structure with separate frontend and backend applications.

## 🚀 Features

- **Frontend**: Built with React, TypeScript, and Vite
- **Backend**: Node.js with Express
- **Styling**: Tailwind CSS with Headless UI components
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with validation
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Code Quality**: ESLint and Prettier for consistent code style

## 📦 Project Structure

```
.
├── apps/
│   ├── app/                            # Frontend React application
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
│   ├── backend/                       # Backend Express application
│   │   ├── src/
│   │   │   ├── config/               # Configuration files
│   │   │   │   ├── database.ts       # Database configuration
│   │   │   │   └── swagger.ts        # API documentation
│   │   │   │
│   │   │   ├── controllers/          # Request handlers
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── member.controller.ts
│   │   │   │   └── dashboard.controller.ts
│   │   │   │
│   │   │   ├── middleware/           # Express middleware
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── upload.middleware.ts
│   │   │   │
│   │   │   ├── models/               # Database models
│   │   │   │   ├── member.model.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── role.model.ts
│   │   │   │   └── activity-log.model.ts
│   │   │   │
│   │   │   ├── routes/               # API routes
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── member.routes.ts
│   │   │   │   └── dashboard.routes.ts
│   │   │   │
│   │   │   ├── seed/                 # Database seed data
│   │   │   │   └── seed.ts
│   │   │   │
│   │   │   ├── types/                # TypeScript type definitions
│   │   │   ├── utils/                # Utility functions
│   │   │   └── validators/           # Request validation
│   │   │
│   │   └── assets/                   # Static assets
│   │
│   ├── app-e2e/                      # Frontend E2E tests
│   └── backend-e2e/                  # Backend E2E tests
│
├── libs/                             # Shared libraries
├── tools/                            # Build and development tools
└── package.json                      # Project dependencies and scripts
```

## 🛠️ Prerequisites

- Node.js (v16 or later recommended)
- pnpm (v8 or later)
- MongoDB (v6 or later) running locally
- Git

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

1. Start the backend server in development mode:
   ```bash
   npx nx serve backend
   ```
   The backend will be available at `http://localhost:3000` by default.

2. In a separate terminal, start the frontend development server:
   ```bash
   npx nx serve app
   ```
   The frontend will be available at `http://localhost:4200` by default.

### Database Setup

Make sure you have MongoDB running locally on the default port (27017) or update the `MONGODB_URI` in your `.env` file to point to your MongoDB instance.

### First-Time Setup

If this is your first time setting up the application, you may need to seed the database with initial data (if applicable):
```bash
nx run backend:seed
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
npx nx run-many --target=build --all

# Or build individually
npx nx build app
npx nx build backend
```

## 🔧 Code Quality

- Lint the code:
  ```bash
  npx nx lint
  ```

- Format the code:
  ```bash
  npx nx format:write
  ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) for details.

## 🙏 Acknowledgments

- Built with [Nx](https://nx.dev)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- And all other amazing open-source projects used in this project
