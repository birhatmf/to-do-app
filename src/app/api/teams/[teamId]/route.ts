import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { Role } from '@prisma/client';

interface RouteParams {
  params: Promise<{ teamId: string }>;
}

// DELETE /api/teams/:teamId - Delete team
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;
  const { teamId } = await params;

  // Permission check: Sadece Admin takım silebilir
  if (user.role !== Role.ADMIN) {
    return NextResponse.json(
      { success: false, error: 'Takım silme yetkiniz yok' },
      { status: 403 }
    );
  }

  try {
    // Takımı bul
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        _count: {
          select: {
            users: true,
            projects: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Takım bulunamadı' },
        { status: 404 }
      );
    }

    // Takımda kullanıcı veya proje varsa silinmez
    if (team._count.users > 0 || team._count.projects > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Takımda kullanıcılar veya projeler olduğu için silinemez',
        },
        { status: 400 }
      );
    }

    // Takımı sil
    await prisma.team.delete({
      where: { id: teamId },
    });

    return NextResponse.json({
      success: true,
      message: 'Takım silindi',
    });
  } catch (error) {
    console.error('Team DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
