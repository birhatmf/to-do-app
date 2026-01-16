import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { getTeamScope } from '@/lib/policies';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

// GET /api/users - List users (scoped)
export async function GET(request: NextRequest) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  try {
    // Scoping: Admin tüm kullanıcıları görür, diğerleri sadece kendi ekibini
    const users = await prisma.user.findMany({
      where: {
        teamId: getTeamScope(user),
      },
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
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create user
export async function POST(request: NextRequest) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  // Permission check: Sadece Admin ve Manager kullanıcı oluşturabilir
  if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
    return NextResponse.json(
      { success: false, error: 'Kullanıcı oluşturma yetkiniz yok' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, password, role, teamId } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'İsim, email ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Role kontrolü: Manager sadece EMPLOYEE oluşturabilir
    if (user.role === Role.MANAGER && role && role !== Role.EMPLOYEE) {
      return NextResponse.json(
        { success: false, error: 'Manager sadece Employee oluşturabilir' },
        { status: 403 }
      );
    }

    // Team kontrolü: Manager sadece kendi ekibine kullanıcı ekleyebilir
    if (user.role === Role.MANAGER) {
      const targetTeamId = teamId || user.teamId;
      if (targetTeamId !== user.teamId) {
        return NextResponse.json(
          { success: false, error: 'Sadece kendi ekibinize kullanıcı ekleyebilirsiniz' },
          { status: 403 }
        );
      }
    }

    // Email zaten kullanımda mı?
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Bu email zaten kullanımda' },
        { status: 400 }
      );
    }

    // Password hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || Role.EMPLOYEE,
        teamId: user.role === Role.ADMIN ? (teamId || null) : user.teamId,
        mustChangePassword: true, // Yeni kullanıcılar şifre değiştirmek zorunda
      },
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
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newUser,
    }, { status: 201 });
  } catch (error) {
    console.error('User POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
