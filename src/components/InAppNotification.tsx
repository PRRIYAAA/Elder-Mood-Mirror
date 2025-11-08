import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, CheckCircle, Heart, Sparkles, Target } from "lucide-react";
import { useEffect, useRef } from "react";

interface InAppNotificationProps {
  show: boolean;
  type: 'survey' | 'camera' | 'both' | 'welcome' | 'progress' | null;
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export function InAppNotification({ show, type, message, onDismiss, duration = 5000 }: InAppNotificationProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (show && duration > 0) {
      timerRef.current = setTimeout(() => {
        onDismiss();
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [show, duration, onDismiss]);

  const handleManualDismiss = () => {
    // Clear the auto-dismiss timer when manually dismissed
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onDismiss();
  };

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'both':
        return <Heart className="w-6 h-6 text-green-600" />;
      case 'survey':
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
      case 'camera':
        return <CheckCircle className="w-6 h-6 text-purple-600" />;
      case 'welcome':
        return <Sparkles className="w-6 h-6 text-indigo-600" />;
      case 'progress':
        return <Target className="w-6 h-6 text-orange-600" />;
      default:
        return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'both':
        return 'bg-green-50 border-green-200';
      case 'survey':
        return 'bg-blue-50 border-blue-200';
      case 'camera':
        return 'bg-purple-50 border-purple-200';
      case 'welcome':
        return 'bg-indigo-50 border-indigo-200';
      case 'progress':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="fixed inset-x-4 top-4 z-50 animate-in slide-in-from-top duration-500">
      <Card className={`${getBgColor()} shadow-xl border-2`}>
        <div className="p-5">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base text-gray-800 leading-relaxed font-medium">
                {message}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualDismiss}
              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-200 active:bg-gray-300 rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}