import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';
import { Role } from '@prisma/client';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

// DELETE /api/users/:userId - Delete user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await authenticate(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;
  const { userId } = await params;

  // Permission check: Sadece Admin kullanıcı silebilir
  if (user.role !== Role.ADMIN) {
    return NextResponse.json(
      { success: false, error: 'Kullanıcı silme yetkiniz yok' },
      { status: 403 }
    );
  }

  // Kendini silemez
  if (userId === user.id) {
    return NextResponse.json(
      { success: false, error: 'Kendinizi silemezsiniz' },
      { status: 400 }
    );
  }

  try {
    // Kullanıcıyı bul
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcıyı sil (cascade delete ile task assignee'leri null olur)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı silindi',
    });
  } catch (error) {
    console.error('User DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
