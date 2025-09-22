import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    name: 'Members',
    href: '/members',
    icon: (
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0111.357-3.17M13 7a4 4 0 11-8 0 4 4 0 018 0zm6 8a4 4 0 100 8 4 4 0 000-8zm-7 4a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: (
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    children: [
      { name: 'Monthly', href: '/reports/monthly', icon: null },
      { name: 'Quarterly', href: '/reports/quarterly', icon: null },
      { name: 'Yearly', href: '/reports/yearly', icon: null },
    ],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: (
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export const Sidebar = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-border bg-card">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) =>
              !item.children ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-accent-foreground'
                    )}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ) : (
                <Disclosure as="div" key={item.name} className="space-y-1">
                  {({ open }) => {
                    const isItemActive =
                      isActive(item.href) ||
                      item.children?.some((child) => isActive(child.href));
                    return (
                      <>
                        <Disclosure.Button
                          className={cn(
                            'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md transition-colors',
                            isItemActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            'focus:outline-none focus:ring-2 focus:ring-primary/50'
                          )}
                        >
                          <span
                            className={cn(
                              'mr-3 flex-shrink-0 h-5 w-5',
                              isItemActive
                                ? 'text-primary'
                                : 'text-muted-foreground group-hover:text-accent-foreground'
                            )}
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronDownIcon
                            className={cn(
                              'ml-3 h-5 w-5 transform transition-transform duration-200',
                              open ? 'rotate-180' : 'rotate-0',
                              isItemActive
                                ? 'text-primary/70'
                                : 'text-muted-foreground/50 group-hover:text-muted-foreground'
                            )}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="pl-4 space-y-1">
                          {' '}
                          {item.children?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={cn(
                                'group w-full flex items-center pl-9 pr-2 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive(subItem.href)
                                  ? 'bg-primary/5 text-primary'
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                              )}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </Disclosure.Panel>
                      </>
                    );
                  }}
                </Disclosure>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
