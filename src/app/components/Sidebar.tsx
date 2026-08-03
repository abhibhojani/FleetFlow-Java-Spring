import React from 'react';
import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Truck,
  Map,
  Wrench,
  Fuel,
  Users,
  BarChart3,
  LogOut,
  Settings
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { name: 'Command Center', icon: LayoutDashboard, path: '/' },
  { name: 'Vehicle Registry', icon: Truck, path: '/registry' },
  { name: 'Trip Dispatcher', icon: Map, path: '/dispatcher' },
  { name: 'Maintenance Logs', icon: Wrench, path: '/maintenance' },
  { name: 'Expense & Fuel', icon: Fuel, path: '/expenses' },
  { name: 'Driver Profiles', icon: Users, path: '/drivers' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
];

export function Sidebar() {
  const role = localStorage.getItem('fleet_role') || 'manager';

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (role === 'dispatcher') {
      return !['/maintenance', '/expenses', '/analytics'].includes(item.path);
    }
    return true; // Manager sees all
  });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-[#1A202C] text-white">
      <div className="flex h-16 items-center px-6 border-b border-slate-700">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <span>FleetFlow</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <item.icon
              className={clsx(
                'mr-3 h-5 w-5 flex-shrink-0',
              )}
            />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <NavLink
          to="/login"
          onClick={() => {
            localStorage.removeItem('fleet_token');
            localStorage.removeItem('fleet_user');
            localStorage.removeItem('fleet_role');
          }}
          className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
          Sign Out
        </NavLink>
      </div>
    </aside>
  );
}
