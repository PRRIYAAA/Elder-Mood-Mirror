import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Camera, ClipboardList, TrendingUp, Calendar, CheckCircle2, Circle, User, Edit, Activity, Zap, Moon, Heart, ArrowRight } from 'lucide-react';
import { getCompletionStatus, getMoodSurveys, getCameraMoods } from '../utils/api';
import { ProfileDialog } from './ProfileDialog';

interface DashboardProps {
  userData: any;
  elderData: any;
  onStartSurvey: () => void;
  onStartCamera: () => void;
  onElderDataUpdate?: (data: any) => void;
}

export function Dashboard({ userData, elderData, onStartSurvey, onStartCamera, onElderDataUpdate }: DashboardProps) {
  const [completionStatus, setCompletionStatus] = useState<any>({ surveyCompleted: false, cameraCompleted: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [recentMood, setRecentMood] = useState<string | null>(null);
  const [weeklyStreak, setWeeklyStreak] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await getCompletionStatus();
      if (response.success) {
        setCompletionStatus(response.completionStatus);
      }

      // Load recent surveys for mood display
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      const startStr = startDate.toISOString().split('T')[0];

      const surveysResponse = await getMoodSurveys(startStr, endDate);
      if (surveysResponse.success && surveysResponse.surveys.length > 0) {
        const sortedSurveys = surveysResponse.surveys.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentMood(sortedSurveys[0]?.overall_mood);
        
        // Calculate streak
        const streak = surveysResponse.surveys.filter((s: any) => {
          const surveyDate = new Date(s.date);
          const daysDiff = Math.floor((new Date().getTime() - surveyDate.getTime()) / (1000 * 60 * 60 * 24));
          return daysDiff <= 7;
        }).length;
        setWeeklyStreak(streak);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleProfileUpdate = (updatedData: any) => {
    if (onElderDataUpdate) {
      onElderDataUpdate(updatedData);
    }
  };

  const getMoodEmoji = (mood: string | null) => {
    if (!mood) return '😊';
    const moodEmojis: { [key: string]: string } = {
      'very_happy': '😄',
      'happy': '😊',
      'neutral': '😐',
      'sad': '😢',
      'very_sad': '😞'
    };
    return moodEmojis[mood] || '😊';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const allTasksCompleted = completionStatus.surveyCompleted && completionStatus.cameraCompleted;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-semibold text-gray-800 mb-2">
              {getGreeting()}, {elderData?.fullName || userData?.name || 'Friend'}! {getMoodEmoji(recentMood)}
            </h2>
            <p className="text-xl text-gray-600">{getTodayDate()}</p>
            {allTasksCompleted && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">All activities completed today! 🎉</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 h-12 px-6"
            >
              <User className="w-5 h-5" />
              My Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Dialog */}
      <ProfileDialog 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        elderData={elderData}
        onUpdate={handleProfileUpdate}
      />

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {(completionStatus.surveyCompleted ? 1 : 0) + (completionStatus.cameraCompleted ? 1 : 0)}/2
            </p>
            <p className="text-xs text-gray-600">Today's Tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{weeklyStreak}</p>
            <p className="text-xs text-gray-600">Week Streak</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800 capitalize">
              {recentMood ? recentMood.replace('_', ' ') : 'Track'}
            </p>
            <p className="text-xs text-gray-600">Recent Mood</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-200">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {allTasksCompleted ? '100' : 
               (completionStatus.surveyCompleted || completionStatus.cameraCompleted) ? '50' : '0'}%
            </p>
            <p className="text-xs text-gray-600">Today's Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Tasks Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood Survey Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Daily Mood Survey</CardTitle>
                  <CardDescription>Share how you're feeling today</CardDescription>
                </div>
              </div>
              {completionStatus.surveyCompleted ? (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              ) : (
                <Circle className="w-8 h-8 text-gray-300" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {completionStatus.surveyCompleted ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✓ Completed for today</p>
                  <p className="text-sm text-green-600 mt-1">Great job staying consistent!</p>
                </div>
                <Button 
                  onClick={onStartSurvey}
                  variant="outline"
                  className="w-full"
                >
                  View or Retake Survey
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">
                  Take a few minutes to complete your daily mood survey. Your responses help track your wellness journey.
                </p>
                <Button 
                  onClick={onStartSurvey}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Start Survey
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Camera Mood Detection Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Camera Mood Detection</CardTitle>
                  <CardDescription>AI-powered facial analysis</CardDescription>
                </div>
              </div>
              {completionStatus.cameraCompleted ? (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              ) : (
                <Circle className="w-8 h-8 text-gray-300" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {completionStatus.cameraCompleted ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✓ Completed for today</p>
                  <p className="text-sm text-green-600 mt-1">Mood captured successfully!</p>
                </div>
                <Button 
                  onClick={onStartCamera}
                  variant="outline"
                  className="w-full"
                >
                  Retake Photo
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">
                  Use your camera for AI-powered mood detection. Our technology analyzes facial expressions to track your emotional state.
                </p>
                <Button 
                  onClick={onStartCamera}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  Open Camera
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Daily Wellness Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800">
            Regular mood tracking helps identify patterns and triggers in your emotional wellness. 
            Try to complete both activities at a similar time each day for the most accurate insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}