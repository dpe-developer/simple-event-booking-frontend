import StickyNavbar from '@/components/StickyNavbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="h-auto w-auto">
      <StickyNavbar />
      <main>
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
