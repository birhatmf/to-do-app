import { TaskStatus } from '@prisma/client';

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusConfig = {
  TODO: {
    label: 'Yapılacak',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  IN_PROGRESS: {
    label: 'Sürüyor',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  DONE: {
    label: 'Tamamlandı',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
