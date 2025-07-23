import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { MembersPage } from './pages/MembersPage';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Layout } from './components/layout/Layout';
import { NotFound } from './pages/NotFound';
import { Unauthorized } from './pages/Unauthorized';
import { MemberLayout } from './layouts/MemberLayout';
import { MemberDetail } from './components/members/MemberDetail';
import { MemberForm } from './components/members/MemberForm';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Member management routes */}
              <Route
                path="members"
                element={
                  <ProtectedRoute requiredRole={['admin', 'manager']}>
                    <MemberLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<MembersPage />} />
                <Route path="new" element={<MemberForm />} />
                <Route path=":id" element={<MemberDetail />} />
                <Route path=":id/edit" element={<MemberForm />} />
              </Route>

              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 - Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
