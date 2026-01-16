'use client';

import { useEffect, useState } from 'react';
import { TaskWithProjectTeam } from '@/types';
import { StatusBadge } from '@/components/ui/status-badge';
import { TaskStatus, EstimateUnit } from '@prisma/client';
import Modal from '@/components/ui/Modal';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithProjectTeam[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    assigneeId: '',
    projectId: '',
    q: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Create Task Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState<{
    projectId: string;
    title: string;
    description: string;
    estimateValue: string;
    estimateUnit: EstimateUnit;
    assigneeId: string;
    status: TaskStatus;
  }>({
    projectId: '',
    title: '',
    description: '',
    estimateValue: '',
    estimateUnit: EstimateUnit.HOUR,
    assigneeId: '',
    status: TaskStatus.TODO,
  });

  // Edit Task Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithProjectTeam | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filters, page]);

  const fetchTasks = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.assigneeId) params.set('assigneeId', filters.assigneeId);
    if (filters.projectId) params.set('projectId', filters.projectId);
    if (filters.q) params.set('q', filters.q);
    params.set('page', page.toString());
    params.set('pageSize', '20');

    try {
      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTasks(data.data.items);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const updateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', assigneeId: '', projectId: '', q: '' });
    setPage(1);
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!confirm(`${taskTitle} görevini silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Görev silinemedi');
      }

      fetchTasks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          estimateValue: newTask.estimateValue ? parseInt(newTask.estimateValue) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Görev oluşturulamadı');
      }

      setNewTask({
        projectId: '',
        title: '',
        description: '',
        estimateValue: '',
        estimateUnit: EstimateUnit.HOUR,
        assigneeId: '',
        status: TaskStatus.TODO,
      });
      setIsCreateModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          estimateValue: editingTask.estimateValue,
          estimateUnit: editingTask.estimateUnit,
          assigneeId: editingTask.assigneeId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Görev güncellenemedi');
      }

      setIsEditModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Görevler</h1>
          <p className="text-gray-600">Tüm görevleri yönetin</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          + Yeni Görev
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Ara..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="">Tüm Durumlar</option>
            <option value="TODO">Yapılacak</option>
            <option value="IN_PROGRESS">Sürüyor</option>
            <option value="DONE">Tamamlandı</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">Görev bulunamadı</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Yeni Görev Oluştur
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proje</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görev</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahmini</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setEditingTask(task);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {task.project.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-primary">
                            {task.assignee?.name.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">
                          {task.assignee?.name || 'Atanmamış'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.estimateValue && task.estimateUnit && (
                        `${task.estimateValue} ${task.estimateUnit === EstimateUnit.HOUR ? 'Saat' : task.estimateUnit === EstimateUnit.DAY ? 'Gün' : 'Hafta'}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={task.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(task.id, e.target.value as TaskStatus);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm border-gray-300 rounded focus:ring-2 focus:ring-primary"
                      >
                        <option value="TODO">Yapılacak</option>
                        <option value="IN_PROGRESS">Sürüyor</option>
                        <option value="DONE">Tamamlandı</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTask(task);
                            setIsEditModalOpen(true);
                          }}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id, task.title);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <span className="text-sm text-gray-600">
              Sayfa {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Yeni Görev">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proje *
            </label>
            <select
              value={newTask.projectId}
              onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Proje Seçin</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Görev Başlığı *
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Örn: Kullanıcı girişi implementasyonu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Görev detayları..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahmini Süre
              </label>
              <input
                type="number"
                value={newTask.estimateValue}
                onChange={(e) => setNewTask({ ...newTask, estimateValue: e.target.value })}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birim
              </label>
              <select
                value={newTask.estimateUnit}
                onChange={(e) => setNewTask({ ...newTask, estimateUnit: e.target.value as EstimateUnit })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value={EstimateUnit.HOUR}>Saat</option>
                <option value={EstimateUnit.DAY}>Gün</option>
                <option value={EstimateUnit.WEEK}>Hafta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Atanan Kişi
            </label>
            <select
              value={newTask.assigneeId}
              onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Atanmamış</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting || !newTask.projectId || !newTask.title}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Görev Düzenle">
        {editingTask && (
          <form onSubmit={handleEditTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Görev Başlığı *
              </label>
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                value={editingTask.description || ''}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahmini Süre
                </label>
                <input
                  type="number"
                  value={editingTask.estimateValue || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, estimateValue: parseInt(e.target.value) || null })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birim
                </label>
                <select
                  value={editingTask.estimateUnit || EstimateUnit.HOUR}
                  onChange={(e) => setEditingTask({ ...editingTask, estimateUnit: e.target.value as EstimateUnit })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value={EstimateUnit.HOUR}>Saat</option>
                  <option value={EstimateUnit.DAY}>Gün</option>
                  <option value={EstimateUnit.WEEK}>Hafta</option>
                </select>
              </div>
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
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
