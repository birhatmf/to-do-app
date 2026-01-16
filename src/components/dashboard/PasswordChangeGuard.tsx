'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthUser {
  mustChangePassword?: boolean;
}

interface PasswordChangeGuardProps {
  user: AuthUser;
  children: React.ReactNode;
}

export default function PasswordChangeGuard({ user, children }: PasswordChangeGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // If user must change password and is not on profile page, redirect
    if (user.mustChangePassword && pathname !== '/dashboard/profile' && !hasRedirected) {
      setHasRedirected(true);
      router.push('/dashboard/profile');
    }
  }, [user.mustChangePassword, pathname, router, hasRedirected]);

  // If user must change password and is on profile page, show children normally
  // Otherwise, show children as well
  return <>{children}</>;
}
