import { Outlet } from 'react-router-dom';
import StickyNavbar from '@/components/StickyNavbar';

export default function AuthenticatedLayout() {
  return (
    <div className="h-auto w-auto">
      <StickyNavbar />

      <main className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
