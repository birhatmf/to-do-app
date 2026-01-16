'use client';

import { useState } from 'react';
import { TaskWithProjectTeam } from '@/types';
import { StatusBadge } from '@/components/ui/status-badge';
import { TaskStatus, EstimateUnit } from '@prisma/client';
import Modal from '@/components/ui/Modal';

interface TaskTableProps {
  tasks: TaskWithProjectTeam[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
}

export default function TaskTableWithModal({ tasks }: TaskTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithProjectTeam | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch users and projects when modal opens
  const openEditModal = async (task: TaskWithProjectTeam) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
    setError('');

    // Fetch users and projects if not already loaded
    if (users.length === 0) {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/projects'),
        ]);

        const usersData = await usersRes.json();
        const projectsData = await projectsRes.json();

        if (usersData.success) setUsers(usersData.data);
        if (projectsData.success) setProjects(projectsData.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
  };

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Görev güncellenirken hata oluştu');
        return;
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">Henüz görev yok</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto -mx-4 lg:mx-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proje
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Görev
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Atanan
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-gray-50 cursor-pointer transition"
                onClick={() => openEditModal(task)}
              >
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task.project.name}</div>
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <div>
                    <span className="text-sm font-medium text-primary hover:text-primary/80">
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
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
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value={TaskStatus.TODO}>Todo</option>
                    <option value={TaskStatus.IN_PROGRESS}>Sürüyor</option>
                    <option value={TaskStatus.DONE}>Bitti</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Görev Düzenle"
        >
          <form onSubmit={updateTask} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proje
              </label>
              <select
                value={editingTask.projectId}
                onChange={(e) => setEditingTask({ ...editingTask, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
              >
                <option value="">Proje Seçin</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                value={editingTask.description || ''}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Atanan Kişi
              </label>
              <select
                value={editingTask.assigneeId || ''}
                onChange={(e) => setEditingTask({ ...editingTask, assigneeId: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">Atanmamış</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value={TaskStatus.TODO}>Todo</option>
                <option value={TaskStatus.IN_PROGRESS}>Sürüyor</option>
                <option value={TaskStatus.DONE}>Bitti</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
              >
                {submitting ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
              >
                İptal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
