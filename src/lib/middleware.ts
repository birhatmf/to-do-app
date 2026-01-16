import { NextRequest } from 'next/server';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { unauthorizedResponse } from '@/lib/policies';

export interface AuthContext {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    teamId: string | null;
  };
}

// API route'larda kullanılan auth middleware
export async function authenticate(request: NextRequest): Promise<AuthContext | Response> {
  const token = await getTokenFromCookie();

  if (!token) {
    return new Response(
      JSON.stringify({ success: false, error: 'Yetkilendirme gerekli' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const payload = verifyToken(token);
  if (!payload) {
    return new Response(
      JSON.stringify({ success: false, error: 'Geçersiz token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Fresh user data
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ success: false, error: 'Kullanıcı bulunamadı' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
    },
  };
}

// Role kontrolü
export function requireRole(allowedRoles: Role[]) {
  return async (request: NextRequest): Promise<AuthContext | Response> => {
    const authResult = await authenticate(request);

    if (authResult instanceof Response) {
      return authResult;
    }

    if (!allowedRoles.includes(authResult.user.role)) {
      return unauthorizedResponse();
    }

    return authResult;
  };
}
