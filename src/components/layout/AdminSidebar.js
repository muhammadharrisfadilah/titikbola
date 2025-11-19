// ========================================
// ADMIN SIDEBAR COMPONENT
// Navigation sidebar for admin panel
// ========================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const navItems = [
    {
      icon: '🏠',
      label: 'Dashboard',
      href: '/admin/dashboard',
    },
    {
      icon: '⚽',
      label: 'Matches',
      href: '/admin/matches',
    },
    {
      icon: '📊',
      label: 'Analytics',
      href: '/admin/analytics',
    },
    {
      icon: '⚙️',
      label: 'Settings',
      href: '/admin/settings',
    },
  ];
  
  return (
    <aside className="w-64 bg-admin-sidebar min-h-screen border-r border-admin-card">
      {/* Logo */}
      <div className="p-6 border-b border-admin-card">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-3xl">⚽</span>
          <div>
            <h1 className="text-accent-red text-xl font-bold">TitikBola</h1>
            <p className="text-admin-text-muted text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-admin-accent text-white font-medium'
                      : 'text-admin-text hover:bg-admin-card'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* User info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-admin-card">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-admin-accent rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="flex-1">
            <p className="text-admin-text font-medium text-sm">Admin</p>
            <p className="text-admin-text-muted text-xs">admin@titikbola.com</p>
          </div>
        </div>
        <Link
          href="/api/auth/logout"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 mt-2 text-admin-danger hover:bg-admin-card rounded-lg transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  );
}