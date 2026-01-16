import { TaskWithProjectTeam } from '@/types';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';

interface TaskTableProps {
  tasks: TaskWithProjectTeam[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">Henüz görev yok</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proje
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Görev
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Atanan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durum
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{task.project.name}</div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <Link
                    href={`/dashboard/tasks/${task.id}`}
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    {task.title}
                  </Link>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-primary">
                      {task.assignee?.name.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-900">
                    {task.assignee?.name || 'Atanmamış'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={task.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
