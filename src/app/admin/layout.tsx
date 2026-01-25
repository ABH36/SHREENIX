// src/app/admin/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminUser } from '../../lib/auth';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export const metadata: Metadata = {
  title: 'Admin Panel - Shreenix Ayurveda',
  description: 'Manage your e-commerce store',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check
  const user = await getAdminUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}