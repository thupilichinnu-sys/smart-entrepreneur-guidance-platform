import React from 'react';
import { Home, FileCheck, Calculator, Bot, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav: React.FC<{
  currentRoute: string;
  navigate: (route: string) => void;
}> = ({ currentRoute, navigate }) => {
  const { isAuthenticated } = useAuth();

  const tabs = [
    { id: 'home', label: 'Home', route: isAuthenticated ? '/dashboard' : '/', icon: Home },
    { id: 'assess', label: 'Assess', route: '/assessment', icon: FileCheck },
    { id: 'finance', label: 'Finance', route: '/financial-planner', icon: Calculator },
    { id: 'ai', label: 'AI', route: '/ai-advisor', icon: Bot },
    { id: 'profile', label: 'Profile', route: isAuthenticated ? '/profile' : '/login', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200/90 shadow-lg px-2 py-1.5 no-print">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentRoute === tab.route;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.route)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
