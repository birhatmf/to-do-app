import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gerekli'),
  newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalı'),
});

// PATCH /api/user/change-password - Change password
export async function PATCH(request: NextRequest) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const body = await request.json();
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;

    // Mevcut kullanıcıyı getir
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Mevcut şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      currentUser.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Mevcut şifre hatalı' },
        { status: 400 }
      );
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle ve mustChangePassword flag'ini kaldır
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Şifre değiştirildi',
    });
  } catch (error) {
    console.error('Change password PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
