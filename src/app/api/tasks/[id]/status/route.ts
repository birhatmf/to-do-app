import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { updateTaskStatusSchema } from '@/lib/validations';
import { canUpdateStatus } from '@/lib/policies';

// Params
interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/tasks/:id/status - Update task status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;
  const { id } = await params;

  try {
    // Get task with relations
    const task = await prisma.task.findUnique({
      where: { id },
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

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Görev bulunamadı' },
        { status: 404 }
      );
    }

    // Permission check
    if (!canUpdateStatus(user, task)) {
      return NextResponse.json(
        { success: false, error: 'Durum güncelleme yetkiniz yok' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = updateTaskStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz durum bilgisi' },
        { status: 400 }
      );
    }

    // Update status
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: result.data.status },
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
      data: updatedTask,
    });
  } catch (error) {
    console.error('Task status PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
