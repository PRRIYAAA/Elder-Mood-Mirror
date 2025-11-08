import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Smile, Camera, Activity, Download, RefreshCw, ClipboardList } from 'lucide-react';
import { getMoodSurveys, getCameraMoods } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface WeeklyAnalyticsProps {
  elderData: any;
}

export function WeeklyAnalytics({ elderData }: WeeklyAnalyticsProps) {
  const [surveyData, setSurveyData] = useState<any[]>([]);
  const [cameraData, setCameraData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weekRange, setWeekRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    setIsLoading(true);
    try {
      // Get date range for past 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];
      
      setWeekRange({
        start: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        end: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });

      // Fetch survey and camera data
      const [surveysResponse, cameraResponse] = await Promise.all([
        getMoodSurveys(startStr, endStr),
        getCameraMoods(startStr, endStr)
      ]);

      if (surveysResponse.success) {
        setSurveyData(surveysResponse.surveys || []);
      }

      if (cameraResponse.success) {
        setCameraData(cameraResponse.cameraMoods || []);
      }
    } catch (error) {
      console.error('Error loading weekly data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data
  const prepareWeeklyTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const survey = surveyData.find(s => s.date === date);
      const camera = cameraData.find(c => c.date === date);
      
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        date: dayName,
        energyLevel: survey?.energy_level || 0,
        sleepQuality: survey?.sleep_quality || 0,
        moodScore: survey?.overall_mood ? getMoodScore(survey.overall_mood) : 0,
        cameraConfidence: camera?.confidence ? Math.round(camera.confidence * 100) : 0,
      };
    });
  };

  const getMoodScore = (mood: string): number => {
    const moodScores: { [key: string]: number } = {
      'very_happy': 5,
      'happy': 4,
      'neutral': 3,
      'sad': 2,
      'very_sad': 1
    };
    return moodScores[mood] || 3;
  };

  const getMoodDistribution = () => {
    const moodCounts: { [key: string]: number } = {};
    
    surveyData.forEach(survey => {
      const mood = survey.overall_mood || 'neutral';
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    const moodLabels: { [key: string]: string } = {
      'very_happy': 'Very Happy',
      'happy': 'Happy',
      'neutral': 'Neutral',
      'sad': 'Sad',
      'very_sad': 'Very Sad'
    };

    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: moodLabels[mood] || mood,
      value: count
    }));
  };

  const getActivityCompletion = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const hasSurvey = surveyData.some(s => s.date === date);
      const hasCamera = cameraData.some(c => c.date === date);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        date: dayName,
        'Survey Completed': hasSurvey ? 1 : 0,
        'Camera Completed': hasCamera ? 1 : 0,
      };
    });
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  const weeklyTrendData = prepareWeeklyTrendData();
  const moodDistribution = getMoodDistribution();
  const activityCompletion = getActivityCompletion();

  const totalSurveys = surveyData.length;
  const totalCameraMoods = cameraData.length;
  const completionRate = ((totalSurveys + totalCameraMoods) / 14 * 100).toFixed(0);
  const avgEnergyLevel = surveyData.length > 0 
    ? (surveyData.reduce((sum, s) => sum + (s.energy_level || 0), 0) / surveyData.length).toFixed(1)
    : '0.0';
  const avgSleepQuality = surveyData.length > 0 
    ? (surveyData.reduce((sum, s) => sum + (s.sleep_quality || 0), 0) / surveyData.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              📊 Weekly Analytics
            </h2>
            <p className="text-lg text-gray-600">
              {weekRange.start} - {weekRange.end}
            </p>
          </div>
          <Button 
            onClick={loadWeeklyData}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Surveys Completed</p>
                <p className="text-3xl font-bold text-gray-800">{totalSurveys}/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <Camera className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Camera Moods</p>
                <p className="text-3xl font-bold text-gray-800">{totalCameraMoods}/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Energy Level</p>
                <p className="text-3xl font-bold text-gray-800">{avgEnergyLevel}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-800">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend Chart */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Weekly Wellness Trends
          </CardTitle>
          <CardDescription>Track your energy, sleep, and mood over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '14px', fontWeight: '500' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '14px', fontWeight: '500' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', fontWeight: '500' }}
              />
              <Line 
                type="monotone" 
                dataKey="energyLevel" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Energy Level"
                dot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="sleepQuality" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Sleep Quality"
                dot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="moodScore" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Mood Score"
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Completion & Mood Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Activity Completion Chart */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" />
              Daily Activity Completion
            </CardTitle>
            <CardDescription>Survey and camera mood tracking completion</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: '14px', fontWeight: '500' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '14px', fontWeight: '500' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '14px', fontWeight: '500' }}
                />
                <Bar dataKey="Survey Completed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Camera Completed" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood Distribution Pie Chart */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-6 h-6 text-purple-600" />
              Mood Distribution
            </CardTitle>
            <CardDescription>Your emotional patterns this week</CardDescription>
          </CardHeader>
          <CardContent>
            {moodDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-500">No mood data available for this week</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">💡 Weekly Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-purple-800">
              <strong>Average Sleep Quality:</strong> {avgSleepQuality}/10 - {
                parseFloat(avgSleepQuality) >= 7 ? 'Excellent! Keep maintaining your sleep routine.' :
                parseFloat(avgSleepQuality) >= 5 ? 'Good, but there\'s room for improvement.' :
                'Consider improving your sleep habits for better wellness.'
              }
            </p>
            <p className="text-purple-800">
              <strong>Completion Rate:</strong> {completionRate}% - {
                parseInt(completionRate) >= 80 ? 'Outstanding consistency!' :
                parseInt(completionRate) >= 50 ? 'Good effort! Try to maintain daily tracking.' :
                'Try to complete both activities daily for better insights.'
              }
            </p>
            <p className="text-purple-800">
              <strong>Weekly Progress:</strong> You've completed {totalSurveys} surveys and {totalCameraMoods} camera mood checks this week. Your consistent tracking helps us provide better care recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}