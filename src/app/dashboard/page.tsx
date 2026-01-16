import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { TaskStatus, Role } from '@prisma/client';
import KPICard from '@/components/dashboard/KPICard';
import TaskTable from '@/components/dashboard/TaskTable';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const payload = verifyToken(token!);

  const user = await prisma.user.findUnique({
    where: { id: payload!.userId },
    include: { team: true },
  });

  // Build scope
  const isAdmin = user?.role === Role.ADMIN;
  const userTeamId = user?.teamId;

  // Build where clause
  const baseWhere = isAdmin
    ? {}
    : userTeamId
      ? { project: { teamId: userTeamId } }
      : { project: { teamId: 'none' } }; // No access if no team

  // KPI Data
  const [totalTasks, inProgressTasks, doneTasks, upcomingDeadlines] = await Promise.all([
    prisma.task.count({ where: baseWhere }),
    prisma.task.count({
      where: { ...baseWhere, status: TaskStatus.IN_PROGRESS },
    }),
    prisma.task.count({
      where: { ...baseWhere, status: TaskStatus.DONE },
    }),
    prisma.task.count({
      where: {
        ...baseWhere,
        status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
      },
    }),
  ]);

  // Active Tasks
  const activeTasks = await prisma.task.findMany({
    where: {
      ...baseWhere,
      status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          teamId: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600">
          {user?.teamId ? `Takım: ${user?.team?.name || 'Yükleniyor...'}` : 'Tüm Ekipler'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Toplam Görev"
          value={totalTasks}
          icon={<span className="text-2xl">📋</span>}
          color="blue"
        />
        <KPICard
          title="Sürüyor"
          value={inProgressTasks}
          icon={<span className="text-2xl">🔄</span>}
          color="yellow"
        />
        <KPICard
          title="Tamamlanan"
          value={doneTasks}
          icon={<span className="text-2xl">✅</span>}
          color="green"
        />
        <KPICard
          title="Bekleyen"
          value={upcomingDeadlines}
          icon={<span className="text-2xl">⏳</span>}
          color="purple"
        />
      </div>

      {/* Active Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Aktif Görevler</h2>
          <p className="text-sm text-gray-600">Son 5 aktif görev</p>
        </div>
        <TaskTable tasks={activeTasks} />
      </div>
    </div>
  );
}
