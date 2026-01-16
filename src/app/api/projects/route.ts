import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { createProjectSchema } from '@/lib/validations';
import { canCreateProject, getTeamScope } from '@/lib/policies';

// GET /api/projects - List projects (scoped)
export async function GET(request: NextRequest) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  try {
    // Scoping: Admin tüm projeleri görür, diğerleri sadece kendi ekibinin projelerini
    const projects = await prisma.project.findMany({
      where: {
        teamId: getTeamScope(user),
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create project
export async function POST(request: NextRequest) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  // Permission check
  if (!canCreateProject(user)) {
    return NextResponse.json(
      { success: false, error: 'Proje oluşturma yetkiniz yok' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Validate
    const result = createProjectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz proje bilgileri' },
        { status: 400 }
      );
    }

    const { name, teamId } = result.data;

    // Manager için teamId zorunlu
    if (user.role !== 'ADMIN' && !user.teamId) {
      return NextResponse.json(
        { success: false, error: 'Bir ekip üyesi değilsiniz' },
        { status: 400 }
      );
    }

    // Admin için teamId zorunlu
    if (user.role === 'ADMIN' && !teamId) {
      return NextResponse.json(
        { success: false, error: 'Lütfen bir takım seçin' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        teamId: user.role === 'ADMIN' ? (teamId as string) : user.teamId!,
      },
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
      data: project,
    }, { status: 201 });
  } catch (error) {
    console.error('Project POST error:', error);

    // Duplicate project name in team
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
