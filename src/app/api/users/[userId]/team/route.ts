import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { Role } from '@prisma/client';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

// PATCH /api/users/:userId/team - Assign user to team
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;
  const { userId } = await params;

  try {
    const body = await request.json();
    const { teamId } = body;

    // Permission check: Sadece Admin ve Manager kullanıcı atayabilir
    if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı atama yetkiniz yok' },
        { status: 403 }
      );
    }

    // Kullanıcıyı bul
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { team: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Manager kontrolü: Sadece kendi ekibine atayabilir
    if (user.role === Role.MANAGER) {
      if (teamId !== user.teamId) {
        return NextResponse.json(
          { success: false, error: 'Sadece kendi ekibinize kullanıcı atayabilirsiniz' },
          { status: 403 }
        );
      }
    }

    // Admin için team null olabilir (takımdan çıkar)
    if (user.role === Role.ADMIN && !teamId) {
      // Takımdan çıkar
      await prisma.user.update({
        where: { id: userId },
        data: { teamId: null },
      });

      return NextResponse.json({
        success: true,
        message: 'Kullanıcı takımdan çıkarıldı',
      });
    }

    // Takımı bul
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Takım bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcıyı takıma ata
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { teamId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
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
      data: updatedUser,
    });
  } catch (error) {
    console.error('User team PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
