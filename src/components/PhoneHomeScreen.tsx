import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import forestBackground from 'figma:asset/047411eb742b591e3c7661af1bbf7a00d15add5c.png';

interface PhoneHomeScreenProps {
  onOpenElderApp: () => void;
  onOpenGmail: () => void;
  showCompletionNotification: boolean;
  onNotificationClick: () => void;
  onDismissNotification: () => void;
}

interface AppIcon {
  id: string;
  name: string;
  icon: string;
  color: string;
  onClick?: () => void;
}

export function PhoneHomeScreen({ 
  onOpenElderApp, 
  onOpenGmail,
  showCompletionNotification,
  onNotificationClick,
  onDismissNotification
}: PhoneHomeScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Only functional app icons
  const mainApps: AppIcon[] = [
    { id: 'elder', name: 'Elder Mood Mirror', icon: '👵', color: 'bg-gradient-to-br from-pink-200 to-blue-200', onClick: onOpenElderApp },
    { id: 'gmail', name: 'Gmail', icon: 'M', color: 'bg-red-500', onClick: onOpenGmail },
  ];

  const dockApps: AppIcon[] = [
    { id: 'elder-dock', name: 'Elder Mood Mirror', icon: '👵', color: 'bg-gradient-to-br from-pink-200 to-blue-200', onClick: onOpenElderApp },
    { id: 'gmail-dock', name: 'Gmail', icon: 'M', color: 'bg-red-500', onClick: onOpenGmail },
  ];

  const renderAppIcon = (app: AppIcon) => (
    <div 
      key={app.id} 
      className="flex flex-col items-center space-y-2 cursor-pointer transition-transform hover:scale-110"
      onClick={app.onClick}
    >
      <div className={`w-16 h-16 rounded-2xl ${app.color} flex items-center justify-center text-white shadow-lg relative overflow-hidden`}>
        {app.id.includes('elder') ? (
          <span className="text-3xl">👵</span>
        ) : app.id.includes('gmail') ? (
          <span className="text-white text-2xl font-bold">M</span>
        ) : (
          <span className="text-2xl">{app.icon}</span>
        )}
      </div>
      <span className="text-sm text-white text-center leading-tight font-medium drop-shadow-lg">{app.name}</span>
    </div>
  );

  return (
    <div 
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${forestBackground})` }}
    >
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2 text-white">
        <span className="font-medium drop-shadow-lg">{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full drop-shadow-lg"></div>
            <div className="w-1 h-1 bg-white rounded-full drop-shadow-lg"></div>
            <div className="w-1 h-1 bg-white rounded-full drop-shadow-lg"></div>
            <div className="w-1 h-1 bg-white rounded-full drop-shadow-lg"></div>
          </div>
          <div className="text-xs drop-shadow-lg">📶</div>
          <div className="text-xs drop-shadow-lg">📶</div>
          <div className="text-xs drop-shadow-lg">🔋</div>
        </div>
      </div>

      {/* Dynamic Island / Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-b-3xl"></div>

      {/* Completion Notification */}
      {showCompletionNotification && (
        <div className="absolute top-20 left-4 right-4 z-50">
          <Card className="bg-white/95 backdrop-blur-sm border border-green-200 shadow-xl">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎉</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-green-800">Daily Check Complete!</h3>
                  <p className="text-sm text-green-600 mt-1">
                    Great job! Your daily mood survey and photo check are done. 
                    Your weekly report is ready for your caregiver.
                  </p>
                  <div className="flex space-x-3 mt-3">
                    <button 
                      onClick={onNotificationClick}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      View Report
                    </button>
                    <button 
                      onClick={onDismissNotification}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* App Grid */}
      <div className="px-8 pt-16 pb-32">
        {/* Main Apps - Centered */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-8 max-w-xs">
            {mainApps.map(renderAppIcon)}
          </div>
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-8 left-6 right-6">
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-lg border border-white/30">
          <div className="grid grid-cols-2 gap-6 justify-center">
            {dockApps.map(renderAppIcon)}
          </div>
        </div>
      </div>
    </div>
  );
}