'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';
import Modal from '@/components/ui/Modal';

interface Project {
  id: string;
  name: string;
  teamId: string;
  createdAt: string;
  team: {
    id: string;
    name: string;
  };
  _count: {
    tasks: number;
  };
}

interface Team {
  id: string;
  name: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Edit Project Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [updatingProject, setUpdatingProject] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchTeams();
    fetchCurrentUser();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      if (data.success) {
        setTeams(data.data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setCurrentUserRole(data.data.role);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const requestBody: { name: string; teamId?: string } = { name: newProjectName };

      // Admin için teamId ekle
      if (currentUserRole === Role.ADMIN && selectedTeamId) {
        requestBody.teamId = selectedTeamId;
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Proje oluşturulamadı');
      }

      setNewProjectName('');
      setSelectedTeamId('');
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`${projectName} projesini silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Proje silinemedi');
      }

      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canDeleteProject = currentUserRole === Role.ADMIN || currentUserRole === Role.MANAGER;

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUpdatingProject(true);

    try {
      const res = await fetch(`/api/projects/${editingProject!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editProjectName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Proje güncellenemedi');
      }

      setEditProjectName('');
      setEditingProject(null);
      setIsEditModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingProject(false);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditProjectName(project.name);
    setIsEditModalOpen(true);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projeler</h1>
          <p className="text-gray-600">Tüm projeleri yönetin</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          + Yeni Proje
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">Henüz proje yok</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            İlk Projeyi Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.team.name}</p>
                </div>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  {project._count.tasks} görev
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(project)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  title="Proje Düzenle"
                >
                  ✏️
                </button>
                <button
                  onClick={() => router.push(`/dashboard/tasks?projectId=${project.id}`)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition"
                >
                  Görevleri Gör
                </button>
                {canDeleteProject && (
                  <button
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                    disabled={project._count.tasks > 0}
                    title={project._count.tasks > 0 ? 'Proje içinde görev olduğu için silinemez' : 'Proje sil'}
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTeamId('');
          setError('');
        }}
        title="Yeni Proje"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proje Adı
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Örn: E-Ticaret Platformu"
            />
          </div>

          {currentUserRole === Role.ADMIN && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Takım *
              </label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">Takım Seçin</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting || !newProjectName.trim() || (currentUserRole === Role.ADMIN && !selectedTeamId)}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProject(null);
          setEditProjectName('');
          setError('');
        }}
        title="Proje Düzenle"
      >
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proje Adı
            </label>
            <input
              type="text"
              value={editProjectName}
              onChange={(e) => setEditProjectName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Örn: E-Ticaret Platformu"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingProject(null);
                setEditProjectName('');
                setError('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={updatingProject || !editProjectName.trim()}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingProject ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
