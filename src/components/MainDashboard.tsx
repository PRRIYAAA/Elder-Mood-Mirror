import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Camera, 
  FileText, 
  Settings, 
  User, 
  Calendar,
  Heart,
  BarChart3,
  Menu,
  Bell,
  Mail,
  ArrowLeft
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { InAppNotification } from "./InAppNotification";

interface InAppNotification {
  show: boolean;
  type: 'survey' | 'camera' | 'both' | 'welcome' | 'progress' | null;
  message: string;
  duration?: number;
}

interface MainDashboardProps {
  onTakeSurvey: () => void;
  onCameraDetection: () => void;
  onSettings: () => void;
  onBack: () => void;
  userData: any;
  completionStatus: {
    surveyCompleted: boolean;
    cameraCompleted: boolean;
  };
  inAppNotification: InAppNotification;
  onDismissInAppNotification: () => void;
}

export function MainDashboard({ 
  onTakeSurvey, 
  onCameraDetection, 
  onSettings, 
  onBack,
  userData,
  completionStatus,
  inAppNotification,
  onDismissInAppNotification
}: MainDashboardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Mock data for demonstration
  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const surveyStatus = {
    completed: completionStatus.surveyCompleted,
    completedAt: completionStatus.surveyCompleted ? "10:30 AM" : null
  };

  const cameraStatus = {
    completed: completionStatus.cameraCompleted,
    lastCompleted: completionStatus.cameraCompleted ? "Today" : "Not yet"
  };

  const recentMood = "Good";
  const weeklyScore = 85;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative">
      {/* In-App Notification */}
      <InAppNotification 
        show={inAppNotification.show}
        type={inAppNotification.type}
        message={inAppNotification.message}
        onDismiss={onDismissInAppNotification}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-white/20">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl">Good Morning!</h1>
          <p className="text-sm opacity-90">{userData?.name || 'Elder'}</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => setShowMenu(!showMenu)}
          className="relative p-2 hover:bg-white/20"
        >
          <Menu className="w-6 h-6 text-white" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl mb-2">Good morning, {userData?.name || "User"}!</h2>
                <p className="text-blue-100">How are you feeling today?</p>
              </div>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1619165915846-43d3b9445823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGVyc29uJTIwc21pbGluZyUyMGhhcHB5fGVufDF8fHx8MTc1NzMyNDE1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Today's Status */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/90">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">Today's Survey</p>
              {surveyStatus.completed ? (
                <>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                    Completed
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{surveyStatus.completedAt}</p>
                </>
              ) : (
                <Badge variant="outline" className="mt-1">Pending</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/90">
            <CardContent className="p-4 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">Mood Check</p>
              {cameraStatus.completed ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                  Done Today
                </Badge>
              ) : (
                <>
                  <Badge variant="outline" className="mt-1">Pending</Badge>
                  <p className="text-xs text-gray-500 mt-1">Last: {cameraStatus.lastCompleted}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="space-y-4">
          <h3 className="text-gray-700">Daily Activities</h3>
          
          <Button
            onClick={onTakeSurvey}
            className={`w-full h-20 text-left justify-start space-x-4 ${
              surveyStatus.completed 
                ? "bg-green-100 hover:bg-green-200 text-green-800 border border-green-200" 
                : "bg-white hover:bg-gray-50 text-gray-800 shadow-md"
            }`}
            variant={surveyStatus.completed ? "secondary" : "outline"}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              surveyStatus.completed ? "bg-green-200" : "bg-blue-100"
            }`}>
              <FileText className={`w-6 h-6 ${
                surveyStatus.completed ? "text-green-600" : "text-blue-600"
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span>Daily Mood Survey</span>
                {surveyStatus.completed && (
                  <Badge variant="secondary" className="bg-green-200 text-green-800">
                    ✓ Complete
                  </Badge>
                )}
              </div>
              <p className="text-sm opacity-70 mt-1">
                {surveyStatus.completed 
                  ? `Completed at ${surveyStatus.completedAt}` 
                  : "Share how you're feeling today"
                }
              </p>
            </div>
          </Button>

          <Button
            onClick={onCameraDetection}
            className={`w-full h-20 text-left justify-start space-x-4 ${
              cameraStatus.completed 
                ? "bg-green-100 hover:bg-green-200 text-green-800 border border-green-200" 
                : "bg-white hover:bg-gray-50 text-gray-800 shadow-md"
            }`}
            variant={cameraStatus.completed ? "secondary" : "outline"}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              cameraStatus.completed ? "bg-green-200" : "bg-green-100"
            }`}>
              <Camera className={`w-6 h-6 ${
                cameraStatus.completed ? "text-green-600" : "text-green-600"
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span>Camera Mood Check</span>
                {cameraStatus.completed && (
                  <Badge variant="secondary" className="bg-green-200 text-green-800">
                    ✓ Complete
                  </Badge>
                )}
              </div>
              <p className="text-sm opacity-70 mt-1">
                {cameraStatus.completed 
                  ? "Completed today" 
                  : "Let us analyze your facial expressions"
                }
              </p>
            </div>
          </Button>
        </div>

        {/* Quick Stats */}
        <Card className="bg-white/90">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>This Week Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recent Mood</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {recentMood}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weekly Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                    style={{ width: `${weeklyScore}%` }}
                  ></div>
                </div>
                <span className="text-green-600">{weeklyScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onSettings}
            className="h-16 flex flex-col items-center justify-center space-y-1 bg-white/90"
          >
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-xs">View Reports</span>
          </Button>

          <Button
            variant="outline"
            onClick={onSettings}
            className="h-16 flex flex-col items-center justify-center space-y-1 bg-white/90"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>

        {/* Bottom Reminder */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-amber-800">Daily Reminder</p>
                <p className="text-sm text-amber-700">
                  Complete both activities daily for the best care monitoring
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Menu */}
        {showMenu && (
          <Card className="absolute top-20 right-4 z-50 w-48 bg-white shadow-xl border">
            <CardContent className="p-2">
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-10"
                  onClick={() => {
                    setShowMenu(false);
                    onSettings();
                  }}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}