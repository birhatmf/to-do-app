import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to login
  redirect('/login');
}
