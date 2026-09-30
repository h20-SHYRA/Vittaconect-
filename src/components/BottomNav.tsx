import React from 'react';
import { Home, Calendar, BookOpen, User, Activity } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Início', icon: Home },
    { id: 'calendar' as NavTab, label: 'Calendários', icon: Calendar },
    { id: 'symptoms' as NavTab, label: 'Diário', icon: Activity },
    { id: 'education' as NavTab, label: 'Educação', icon: BookOpen },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#E6D4AF]/60 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
      aria-label="Navegação Principal do Aplicativo"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer relative ${
                isActive ? 'text-[#5D1425]' : 'text-stone-500 hover:text-stone-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Golden Glow Dot */}
              {isActive && (
                <span className="absolute top-1 w-1 h-1 rounded-full bg-[#B89243]" />
              )}
              <div
                className={`p-1 rounded-full transition-transform ${
                  isActive ? 'scale-110 bg-[#FAF0F2]' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-[#5D1425] stroke-[2.2]' : 'text-stone-500 stroke-[1.7]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                  isActive ? 'font-bold text-[#5D1425]' : 'font-medium text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
