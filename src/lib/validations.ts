import { z } from 'zod';
import { TaskStatus, EstimateUnit, Role } from '@prisma/client';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(1, 'Şifre gerekli'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Project Schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Proje adı gerekli').max(100, 'Proje adı çok uzun'),
  teamId: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Proje adı gerekli').max(100, 'Proje adı çok uzun'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// Task Schemas
export const createTaskSchema = z.object({
  projectId: z.string().min(1, 'Proje ID gerekli'),
  title: z.string().min(1, 'Görev başlığı gerekli').max(200, 'Başlık çok uzun'),
  description: z.string().optional(),
  estimateValue: z.number().int().positive().optional(),
  estimateUnit: z.enum([EstimateUnit.HOUR, EstimateUnit.DAY, EstimateUnit.WEEK]).optional(),
  assigneeId: z.string().nullable().optional(),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  estimateValue: z.number().int().positive().optional(),
  estimateUnit: z.enum([EstimateUnit.HOUR, EstimateUnit.DAY, EstimateUnit.WEEK]).optional(),
  assigneeId: z.string().nullable().optional(),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

// Filter Schemas
export const taskFiltersSchema = z.object({
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  sort: z.enum(['createdAt_desc', 'createdAt_asc']).default('createdAt_desc'),
});

export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>;
