import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { AuthUser } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz giriş bilgileri' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        team: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Create JWT payload
    const jwtPayload = {
      userId: user.id,
      role: user.role,
      teamId: user.teamId,
    };

    // Sign token
    const token = signToken(jwtPayload);

    // Return user data (without password)
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
      mustChangePassword: user.mustChangePassword,
    };

    // Create response and set cookie directly in header
    const response = NextResponse.json(
      {
        success: true,
        data: authUser,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `auth_token=${token}; HttpOnly; Path=/; SameSite=lax; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
