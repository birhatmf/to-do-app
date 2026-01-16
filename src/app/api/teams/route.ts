import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/teams - List teams
export async function GET(request: NextRequest) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  try {
    // Admin: tüm ekipleri görür
    // Diğerleri: sadece kendi ekibini görür
    const teams = await prisma.team.findMany({
      where: user.role === Role.ADMIN ? undefined : { id: user.teamId || undefined },
      include: {
        _count: {
          select: {
            users: true,
            projects: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error('Teams GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create team
export async function POST(request: NextRequest) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  // Permission check: Sadece Admin ve Manager takım oluşturabilir
  if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
    return NextResponse.json(
      { success: false, error: 'Takım oluşturma yetkiniz yok' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Takım adı gerekli' },
        { status: 400 }
      );
    }

    // Takım adı zaten kullanımda mı?
    const existingTeam = await prisma.team.findUnique({
      where: { name: name.trim() },
    });

    if (existingTeam) {
      return NextResponse.json(
        { success: false, error: 'Bu isimde bir takım zaten var' },
        { status: 400 }
      );
    }

    // Takım oluştur
    const team = await prisma.team.create({
      data: {
        name: name.trim(),
      },
      include: {
        _count: {
          select: {
            users: true,
            projects: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: team,
    }, { status: 201 });
  } catch (error) {
    console.error('Team POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
