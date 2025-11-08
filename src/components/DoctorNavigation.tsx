import { Users, Bell, MessageSquare, TrendingUp, Home } from 'lucide-react';

interface DoctorNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function DoctorNavigation({ currentPage, onNavigate }: DoctorNavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-around py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${isActive ? 'text-green-700' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
