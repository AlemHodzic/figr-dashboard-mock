import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Lightbulb } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-lg">
            F
          </div>
          <div>
            <h1 className="font-semibold tracking-tight">Figr</h1>
            <p className="text-xs text-slate-400">Brand Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="px-3 py-2 text-xs text-slate-500">
          <p>Figr Brand Intelligence</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
