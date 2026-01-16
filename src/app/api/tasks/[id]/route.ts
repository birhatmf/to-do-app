import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { updateTaskSchema } from '@/lib/validations';
import { canEditTask, canDeleteTask } from '@/lib/policies';

// Params
interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/tasks/:id - Update task
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
    if (!canEditTask(user, task)) {
      return NextResponse.json(
        { success: false, error: 'Görev düzenleme yetkiniz yok' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = updateTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz görev bilgileri' },
        { status: 400 }
      );
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: result.data,
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
    console.error('Task PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id - Delete task
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    if (!canDeleteTask(user, task)) {
      return NextResponse.json(
        { success: false, error: 'Görev silme yetkiniz yok' },
        { status: 403 }
      );
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Görev silindi',
    });
  } catch (error) {
    console.error('Task DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
