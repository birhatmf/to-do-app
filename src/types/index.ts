import { Role, TaskStatus, EstimateUnit } from '@prisma/client';

// Auth Types
export interface JWTPayload {
  userId: string;
  role: Role;
  teamId?: string | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  teamId?: string | null;
  mustChangePassword?: boolean;
}

// Task with Relations
export interface TaskWithProjectTeam {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  estimateValue: number | null;
  estimateUnit: EstimateUnit | null;
  createdById: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
  project: {
    id: string;
    name: string;
    teamId: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter Types for Tasks
export interface TaskFilters {
  projectId?: string;
  assigneeId?: string;
  status?: TaskStatus;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: 'createdAt_desc' | 'createdAt_asc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
