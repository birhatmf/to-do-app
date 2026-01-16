import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { createTaskSchema, taskFiltersSchema } from '@/lib/validations';
import { canCreateTask, canAssignTask, getTeamScope } from '@/lib/policies';
import { Role } from '@prisma/client';

// GET /api/tasks - List tasks with filters and pagination
export async function GET(request: NextRequest) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const filters = taskFiltersSchema.parse(Object.fromEntries(searchParams));

    // Build where clause
    const where: any = {
      project: {
        teamId: getTeamScope(user),
      },
    };

    // Optional filters
    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.assigneeId) {
      where.assigneeId = filters.assigneeId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }

    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
      ];
    }

    // Pagination
    const skip = (filters.page - 1) * filters.pageSize;

    // Sorting
    const orderBy: any = {};
    const [sortField, sortDir] = filters.sort.split('_');
    orderBy[sortField] = sortDir;

    // Get total count and data
    const [total, items] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip,
        take: filters.pageSize,
        orderBy,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              teamId: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / filters.pageSize);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Tasks GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create task
export async function POST(request: NextRequest) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const body = await request.json();
    const result = createTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz görev bilgileri' },
        { status: 400 }
      );
    }

    const { projectId, assigneeId, ...taskData } = result.data;

    // Get project to check team
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    // Permission check: can create task in this project?
    if (!canCreateTask(user, project.teamId)) {
      return NextResponse.json(
        { success: false, error: 'Bu projede görev oluşturma yetkiniz yok' },
        { status: 403 }
      );
    }

    // If assigneeId provided, check assignment permission
    if (assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: assigneeId },
      });

      if (!assignee) {
        return NextResponse.json(
          { success: false, error: 'Atanan kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      if (!canAssignTask(user, assignee.teamId || '')) {
        return NextResponse.json(
          { success: false, error: 'Bu kullanıcıya görev atama yetkiniz yok' },
          { status: 403 }
        );
      }
    }

    // Employee: assignee must be self
    if (user.role === Role.EMPLOYEE && assigneeId && assigneeId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Kendinize dışında birine görev atayamazsınız' },
        { status: 403 }
      );
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        ...taskData,
        projectId,
        createdById: user.id,
        assigneeId: assigneeId || (user.role === Role.EMPLOYEE ? user.id : null),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            teamId: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: task,
    }, { status: 201 });
  } catch (error) {
    console.error('Task POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
