import React from 'react';
import { Page, User } from '../types';
import { LayoutDashboard, Briefcase, CheckSquare, ChevronRight, LogOut, FileText } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  user: User;
  onLogout: () => void;
}

const menuItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Дашборд', icon: <LayoutDashboard size={20} /> },
  { page: 'tasks', label: 'Задачи и Клиенты', icon: <CheckSquare size={20} /> },
  { page: 'deals', label: 'Сделки', icon: <Briefcase size={20} /> },
  { page: 'documents', label: 'Документы', icon: <FileText size={20} /> },
];

export default function Sidebar({ currentPage, onPageChange, user, onLogout }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">CRM</span>
          <span className="text-slate-300 font-light">Pro</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Система управления клиентами</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onPageChange(item.page)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              currentPage === item.page
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
            {currentPage === item.page && (
              <ChevronRight size={16} className="ml-auto" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.company}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Выйти"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
