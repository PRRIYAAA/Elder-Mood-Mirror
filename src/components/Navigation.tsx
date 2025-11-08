import { Home, ClipboardList, TrendingUp, FileText, User } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'survey', label: 'Daily Survey', icon: ClipboardList },
    { id: 'analytics', label: 'Weekly Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-md border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center gap-2 py-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                variant={isActive ? 'default' : 'ghost'}
                className={`flex flex-col items-center gap-2 h-auto py-4 px-6 min-w-[120px] ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
