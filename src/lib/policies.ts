import { Role } from '@prisma/client';
import { JWTPayload, TaskWithProjectTeam } from '@/types';

export type AuthUser = {
  id: string;
  role: Role;
  teamId?: string | null;
};

// =============================================================================
// PROJECT POLICIES
// =============================================================================

export function canCreateProject(user: AuthUser): boolean {
  return user.role === Role.ADMIN || user.role === Role.MANAGER;
}

export function canEditProject(user: AuthUser, projectTeamId: string): boolean {
  if (user.role === Role.ADMIN) return true;
  if (user.role === Role.MANAGER) return user.teamId === projectTeamId;
  return false;
}

export function canDeleteProject(user: AuthUser, projectTeamId: string): boolean {
  return canEditProject(user, projectTeamId);
}

// =============================================================================
// TASK POLICIES
// =============================================================================

export function canCreateTask(user: AuthUser, projectTeamId: string): boolean {
  if (user.role === Role.ADMIN) return true;
  if (user.role === Role.MANAGER) return user.teamId === projectTeamId;
  if (user.role === Role.EMPLOYEE) return user.teamId === projectTeamId;
  return false;
}

export function canAssignTask(user: AuthUser, assigneeTeamId: string): boolean {
  if (user.role === Role.ADMIN) return true;
  if (user.role === Role.MANAGER) return user.teamId === assigneeTeamId;
  return false;
}

export function canEditTask(user: AuthUser, task: TaskWithProjectTeam): boolean {
  if (user.role === Role.ADMIN) return true;
  if (user.role === Role.MANAGER) return user.teamId === task.project.teamId;
  if (user.role === Role.EMPLOYEE) return user.id === task.createdById;
  return false;
}

export function canDeleteTask(user: AuthUser, task: TaskWithProjectTeam): boolean {
  // Edit ile aynı kurallar
  return canEditTask(user, task);
}

export function canUpdateStatus(user: AuthUser, task: TaskWithProjectTeam): boolean {
  if (user.role === Role.ADMIN) return true;
  if (user.role === Role.MANAGER) return user.teamId === task.project.teamId;
  if (user.role === Role.EMPLOYEE) {
    return user.id === task.assigneeId || user.id === task.createdById;
  }
  return false;
}

// =============================================================================
// VIEW POLICIES (SCOPING)
// =============================================================================

export function getTeamScope(user: AuthUser): string | undefined {
  if (user.role === Role.ADMIN) return undefined; // Admin tüm verileri görür
  return user.teamId ?? undefined;
}

export function canViewTeam(user: AuthUser, targetTeamId: string): boolean {
  if (user.role === Role.ADMIN) return true;
  return user.teamId === targetTeamId;
}

export function canViewUser(user: AuthUser, targetUserTeamId: string | null): boolean {
  if (user.role === Role.ADMIN) return true;
  return user.teamId === targetUserTeamId;
}

// =============================================================================
// HELPER: Unauthorized Response
// =============================================================================

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ success: false, error: 'Yetkiniz yok' }),
    { status: 403, headers: { 'Content-Type': 'application/json' } }
  );
}
