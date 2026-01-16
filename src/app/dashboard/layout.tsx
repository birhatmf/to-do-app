import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import PasswordChangeGuard from '@/components/dashboard/PasswordChangeGuard';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      team: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <PasswordChangeGuard user={user}>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Topbar */}
          <Topbar user={user} />

          {/* Page Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </PasswordChangeGuard>
  );
}
