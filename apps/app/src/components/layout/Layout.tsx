import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export const Layout = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Will be handled by ProtectedRoute
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar user={user} onLogout={logout} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 md:p-6',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'scrollbar-thin scrollbar-thumb-border scrollbar-track-background hover:scrollbar-thumb-border/80'
          )}
        >
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
