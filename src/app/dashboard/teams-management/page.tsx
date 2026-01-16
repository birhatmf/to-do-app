'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';
import Modal from '@/components/ui/Modal';

interface Team {
  id: string;
  name: string;
  createdAt: string;
  _count: {
    users: number;
    projects: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  teamId: string | null;
}

export default function TeamsManagementPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);

  // Create Team Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newTeamName, setNewTeamName] = useState('');

  // Add User to Team Modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      if (data.success) {
        setTeams(data.data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
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

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTeamName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Takım oluşturulamadı');
      }

      setNewTeamName('');
      setIsCreateModalOpen(false);
      fetchTeams();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddUserToTeam = async () => {
    if (!selectedUserId || !selectedTeamId) return;

    setAddingUser(true);
    setError('');

    try {
      const res = await fetch(`/api/users/${selectedUserId}/team`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: selectedTeamId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Kullanıcı atanamadı');
      }

      setIsAddUserModalOpen(false);
      setSelectedUserId('');
      setSelectedTeamId(null);
      fetchTeams();
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingUser(false);
    }
  };

  const canCreateTeam = currentUserRole === Role.ADMIN || currentUserRole === Role.MANAGER;
  const canDeleteTeam = currentUserRole === Role.ADMIN;
  const availableUsers = users.filter(u => !u.teamId || u.teamId !== selectedTeamId);

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`${teamName} takımını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Takım silinemedi');
      }

      fetchTeams();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Takımlar</h1>
          <p className="text-gray-600">Tüm takımları yönetin</p>
        </div>
        {canCreateTeam && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            + Yeni Takım
          </button>
        )}
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
      ) : teams.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">Henüz takım yok</p>
          {canCreateTeam && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              İlk Takımı Oluştur
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Üyeler</p>
                  <p className="text-2xl font-bold text-gray-900">{team._count.users}</p>
                </div>
                <div>
                  <p className="text-gray-500">Projeler</p>
                  <p className="text-2xl font-bold text-gray-900">{team._count.projects}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/dashboard/team?teamId=${team.id}`)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition"
                >
                  Üyeleri Gör
                </button>
                {canCreateTeam && (
                  <button
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setIsAddUserModalOpen(true);
                    }}
                    className="px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    +
                  </button>
                )}
                {canDeleteTeam && (
                  <button
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                    className="px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                    disabled={team._count.users > 0 || team._count.projects > 0}
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Yeni Takım">
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Takım Adı *
            </label>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Örn: Pazarlama Ekibi"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bu takım için proje ve kullanıcı oluşturabilirsiniz
            </p>
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
              disabled={submitting || !newTeamName.trim()}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add User to Team Modal */}
      <Modal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} title="Üye Ekle">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Seçin
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Seçin...</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) {user.teamId ? '- Mevcut takımı var' : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Mevcut takımı olmayan kullanıcılar gösteriliyor
            </p>
          </div>

          {selectedUserId && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Seçilen kullanıcı <strong>{teams.find(t => t.id === selectedTeamId)?.name}</strong> takımına eklenecek
              </p>
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
              onClick={() => {
                setIsAddUserModalOpen(false);
                setSelectedUserId('');
                setSelectedTeamId(null);
                setError('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              İptal
            </button>
            <button
              onClick={handleAddUserToTeam}
              disabled={!selectedUserId || addingUser}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingUser ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
