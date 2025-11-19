// ========================================
// ADMIN LAYOUT
// Layout wrapper for admin pages
// ========================================

import AdminSidebar from '@/components/layout/AdminSidebar';

export const metadata = {
  title: 'Admin Panel - TitikBola',
  description: 'TitikBola Admin Dashboard',
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-admin-bg">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}