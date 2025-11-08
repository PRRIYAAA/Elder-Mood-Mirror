import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Activity,
  Mail,
  Download,
  BarChart3,
  Smile,
  CheckCircle
} from "lucide-react";

interface WeeklyReportsProps {
  onBack: () => void;
  userData: any;
}

export function WeeklyReports({ onBack, userData }: WeeklyReportsProps) {
  const [selectedWeek, setSelectedWeek] = useState("current");

  // Mock data for weekly report
  const weeklyData = {
    period: "Sep 2 - Sep 8, 2024",
    surveyCompletion: 85, // percentage
    cameraCompletion: 71, // percentage
    averageMood: "Good",
    moodScore: 78,
    dailyMoods: [
      { day: "Mon", mood: "Happy", score: 85, completed: true },
      { day: "Tue", mood: "Good", score: 75, completed: true },
      { day: "Wed", mood: "Neutral", score: 65, completed: true },
      { day: "Thu", mood: "Good", score: 80, completed: true },
      { day: "Fri", mood: "Happy", score: 90, completed: true },
      { day: "Sat", mood: "Good", score: 75, completed: true },
      { day: "Sun", mood: "Happy", score: 85, completed: false }
    ],
    healthMetrics: {
      sleepQuality: 78,
      energyLevel: 72,
      physicalComfort: 65,
      appetite: 85,
      socialInteraction: 70
    },
    medications: {
      adherence: 92,
      missedDoses: 2,
      onTime: 85
    },
    insights: [
      "Your mood has been consistently positive this week",
      "Energy levels were highest on Friday",
      "Sleep quality improved compared to last week",
      "Consider discussing physical comfort with your doctor"
    ],
    recommendations: [
      "Continue your current routine - it's working well!",
      "Try some gentle exercises for physical comfort",
      "Maintain regular sleep schedule",
      "Keep up with social activities"
    ]
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy": return "😊";
      case "good": return "🙂";
      case "neutral": return "😐";
      case "sad": return "😔";
      default: return "🙂";
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "neutral": return "text-gray-600 bg-gray-100";
      case "sad": return "text-orange-600 bg-orange-100";
      default: return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-green-700">Weekly Reports</h1>
        <Button variant="ghost" size="icon">
          <Download className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 space-y-6">
        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl mb-1">Weekly Summary</h2>
                <p className="text-blue-100">{weeklyData.period}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl mb-1">{weeklyData.moodScore}%</div>
                <p className="text-blue-100 text-sm">Overall Score</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getMoodEmoji(weeklyData.averageMood)}</span>
                <span>Average Mood: {weeklyData.averageMood}</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                This Week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="daily">Daily Trends</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Completion Rates */}
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Activity Completion</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Surveys</span>
                    <span className="text-green-600">{weeklyData.surveyCompletion}%</span>
                  </div>
                  <Progress value={weeklyData.surveyCompletion} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Mood Checks</span>
                    <span className="text-blue-600">{weeklyData.cameraCompletion}%</span>
                  </div>
                  <Progress value={weeklyData.cameraCompletion} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Key Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weeklyData.insights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weeklyData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            {/* Daily Mood Chart */}
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Daily Mood Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.dailyMoods.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 text-center">
                          <p className="text-sm text-gray-600">{day.day}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getMoodEmoji(day.mood)}</span>
                          <Badge variant="secondary" className={getMoodColor(day.mood)}>
                            {day.mood}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{day.score}%</p>
                        </div>
                        {day.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            {/* Health Metrics */}
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Health Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(weeklyData.healthMetrics).map(([metric, value]) => (
                  <div key={metric} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize text-gray-700">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-gray-600">{value}%</span>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Medication Adherence */}
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg">Medication Adherence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <p className="text-2xl text-green-600">{weeklyData.medications.adherence}%</p>
                    <p className="text-sm text-gray-600">Overall</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl text-blue-600">{weeklyData.medications.onTime}%</p>
                    <p className="text-sm text-gray-600">On Time</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl text-orange-600">{weeklyData.medications.missedDoses}</p>
                    <p className="text-sm text-gray-600">Missed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Send Report */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="text-amber-800">Weekly Report</p>
                  <p className="text-sm text-amber-700">
                    Auto-sent every Sunday to {userData?.elderInfo?.guardianEmail || "caregiver@example.com"}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => {
                  // Mock sending report
                  alert("Report sent successfully to caregiver!");
                }}
              >
                Send Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}