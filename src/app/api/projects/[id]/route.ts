import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { updateProjectSchema } from '@/lib/validations';
import { canEditProject, canDeleteProject } from '@/lib/policies';

// Params
interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/projects/:id - Update project
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;
  const { id } = await params;

  try {
    // Get project first
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    // Permission check
    if (!canEditProject(user, project.teamId)) {
      return NextResponse.json(
        { success: false, error: 'Proje düzenleme yetkiniz yok' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = updateProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz proje bilgileri' },
        { status: 400 }
      );
    }

    const { name } = result.data;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { name },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    console.error('Project PATCH error:', error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { success: false, error: 'Bu ekipte aynı isimde bir proje zaten var' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id - Delete project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;
  const { id } = await params;

  try {
    // Get project first
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    // Permission check
    if (!canDeleteProject(user, project.teamId)) {
      return NextResponse.json(
        { success: false, error: 'Proje silme yetkiniz yok' },
        { status: 403 }
      );
    }

    // Delete project (tasks will be cascade deleted due to relation)
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Proje silindi',
    });
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
