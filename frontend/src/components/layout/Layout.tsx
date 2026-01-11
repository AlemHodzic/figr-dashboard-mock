import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* pt-[72px] accounts for mobile header (56px) + spacing */}
      <main className="lg:ml-64 p-4 lg:p-8 pt-[72px] lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
