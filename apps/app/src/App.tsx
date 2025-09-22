import { useEffect } from 'react';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MembersPage } from './pages/MembersPage';
import { ProfileWrapper } from './components/profile/ProfileWrapper';
import { Settings } from './pages/Settings';
import { Layout } from './components/layout/Layout';
import { NotFound } from './pages/NotFound';
import { Unauthorized } from './pages/Unauthorized';
import { MemberDetail } from './components/members/MemberDetail';
import { MemberForm } from './components/members/MemberForm';
import MonthlyReport from './pages/reports/MonthlyReport';
import QuarterlyReport from './pages/reports/QuarterlyReport';
import YearlyReport from './pages/reports/YearlyReport';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Add theme class to the document element
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove any existing theme classes
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
};

// Component to handle root path redirection
function HomeRedirect() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemeWrapper>
          <Router>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/home" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Protected Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/members" element={<MembersPage />} />
                  <Route path="/members/new" element={<MemberForm />} />
                  <Route path="/members/:id" element={<MemberDetail />} />
                  <Route path="/members/:id/edit" element={<MemberForm />} />
                  <Route path="/profile" element={<ProfileWrapper />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/reports/monthly" element={<MonthlyReport />} />
                  <Route path="/reports/quarterly" element={<QuarterlyReport />} />
                  <Route path="/reports/yearly" element={<YearlyReport />} />
                </Route>
                
                {/* Root path redirects */}
                <Route path="/" element={<HomeRedirect />} />
                
                {/* 404 - Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ThemeWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
