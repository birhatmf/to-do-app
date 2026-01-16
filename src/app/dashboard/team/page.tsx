'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Role } from '@prisma/client';
import Modal from '@/components/ui/Modal';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  teamId: string | null;
  team: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

interface Team {
  id: string;
  name: string;
}

const roleLabels: Record<Role, string> = {
  ADMIN: 'Yönetici',
  MANAGER: 'Yönetici',
  EMPLOYEE: 'Üye',
};

const roleColors: Record<Role, string> = {
  ADMIN: 'bg-purple-50 text-purple-700',
  MANAGER: 'bg-blue-50 text-blue-700',
  EMPLOYEE: 'bg-gray-50 text-gray-700',
};

export default function TeamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamFilterId = searchParams.get('teamId');

  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);
  const [filterTeamName, setFilterTeamName] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    password: string;
    role: Role;
    teamId: string;
  }>({
    name: '',
    email: '',
    password: '',
    role: Role.EMPLOYEE,
    teamId: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchTeams();
    fetchCurrentUser();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          teamId: newUser.teamId || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Kullanıcı oluşturulamadı');
      }

      setNewUser({
        name: '',
        email: '',
        password: '',
        role: Role.EMPLOYEE,
        teamId: '',
      });
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const canCreateUser = currentUserRole === Role.ADMIN || currentUserRole === Role.MANAGER;
  const canDeleteUser = currentUserRole === Role.ADMIN;

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`${userName} kullanıcısını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Kullanıcı silinemedi');
      }

      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Takım adını bul
  useEffect(() => {
    if (teamFilterId && teams.length > 0) {
      const team = teams.find(t => t.id === teamFilterId);
      if (team) {
        setFilterTeamName(team.name);
      }
    }
  }, [teamFilterId, teams]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ekip Üyeleri</h1>
          <p className="text-gray-600">
            {filterTeamName ? `${filterTeamName} Takımı - Üyeler` : 'Takımınızdaki kişileri görüntüleyin'}
          </p>
        </div>
        {canCreateUser && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            + Yeni Ekip Üyesi
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="mb-4">Üye bulunamadı</p>
            {canCreateUser && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
              >
                İlk Üyeyi Ekle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 lg:mx-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İsim</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Email</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Takım</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                      {user.team?.name || '-'}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/tasks?assigneeId=${user.id}`)}
                          className="text-primary hover:text-primary/80 transition"
                        >
                          Görevler
                        </button>
                        {canDeleteUser && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-red-600 hover:text-red-800 transition"
                            >
                              Sil
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Ekip Üyesi">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İsim *
            </label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Örn: Ahmet Yılmaz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="ornek@taskflow.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre *
            </label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="En az 6 karakter"
            />
          </div>

          {currentUserRole === Role.ADMIN && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value={Role.EMPLOYEE}>Üye</option>
                  <option value={Role.MANAGER}>Yönetici</option>
                  <option value={Role.ADMIN}>Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Takım
                </label>
                <select
                  value={newUser.teamId}
                  onChange={(e) => setNewUser({ ...newUser, teamId: e.target.value })}
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
            </>
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
              disabled={submitting || !newUser.name || !newUser.email || !newUser.password}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
