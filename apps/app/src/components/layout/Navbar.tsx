import React, { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
// @ts-ignore
import { Link, useLocation } from 'react-router-dom';
import { AuthResponse } from '../../services/auth.service';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  user: AuthResponse['user'];
  onLogout: () => Promise<void>;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Members', href: '/members' },
  { name: 'Reports', href: '/reports' },
];

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onLogout();
  };

  return (
    <Disclosure as="nav" className="bg-card shadow-sm border-b">
      {({ open }) => (
        <>
          <div className="container">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink items-center">
                  <Link
                    to="/"
                    className="text-xl font-bold text-primary hover:text-primary/90 transition-colors"
                  >
                    RegisTrack
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
                  {navigation.map((item) => {
                    const isActive = currentPath.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground',
                          'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors'
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                {/* Theme Toggle */}
                <div className="flex items-center">
                  <ThemeToggle />
                </div>

                {/* Notifications */}
                <button
                  type="button"
                  className="relative rounded-full p-1 text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        {user?.username
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment as React.ComponentType}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-popover py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={cn(
                              active ? 'bg-accent' : '',
                              'block px-4 py-2 text-sm text-foreground/90 w-full text-left'
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={cn(
                              active ? 'bg-accent' : '',
                              'block px-4 py-2 text-sm text-foreground/90 w-full text-left'
                            )}
                          >
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={cn(
                              active ? 'bg-accent' : '',
                              'block w-full px-4 py-2 text-left text-sm text-foreground/90'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:bg-accent/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = currentPath.startsWith(item.href);
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={cn(
                      isActive
                        ? 'bg-accent text-accent-foreground border-l-4 border-primary'
                        : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground',
                      'block py-2 pl-3 pr-4 text-base font-medium transition-colors'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
            <div className="border-t border-accent/50 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {user?.username
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">
                    {user?.name}
                  </div>
                  <div className="text-sm font-medium text-foreground/70">
                    {user?.email}
                  </div>
                </div>
                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as={Link}
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-foreground/80 hover:bg-accent/50 hover:text-foreground"
                >
                  Your Profile
                </Disclosure.Button>
                <Disclosure.Button
                  as={Link}
                  to="/settings"
                  className="block px-4 py-2 text-base font-medium text-foreground/80 hover:bg-accent/50 hover:text-foreground"
                >
                  Settings
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-base font-medium text-foreground/80 hover:bg-accent/50 hover:text-foreground"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
