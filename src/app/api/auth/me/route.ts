import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AuthUser } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = await getTokenFromCookie();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme yok' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        team: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
      mustChangePassword: user.mustChangePassword,
    };

    return NextResponse.json({
      success: true,
      data: authUser,
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
