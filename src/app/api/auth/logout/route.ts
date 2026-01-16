import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Cookie'yi sil
    const response = NextResponse.json(
      {
        success: true,
        message: 'Çıkış başarılı',
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': 'auth_token=; HttpOnly; Path=/; SameSite=lax; Max-Age=0',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
