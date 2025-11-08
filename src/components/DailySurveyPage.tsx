import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Camera, ClipboardList, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { getCompletionStatus } from '../utils/api';

interface DailySurveyPageProps {
  onStartSurvey: () => void;
  onStartCamera: () => void;
}

export function DailySurveyPage({ onStartSurvey, onStartCamera }: DailySurveyPageProps) {
  const [completionStatus, setCompletionStatus] = useState<any>({ 
    surveyCompleted: false, 
    cameraCompleted: false 
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompletionStatus();
  }, []);

  const loadCompletionStatus = async () => {
    try {
      const response = await getCompletionStatus();
      if (response.success) {
        setCompletionStatus(response.completionStatus);
      }
    } catch (error) {
      console.error('Error loading completion status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const allCompleted = completionStatus.surveyCompleted && completionStatus.cameraCompleted;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-3">
            📝 Daily Check-In
          </h2>
          <p className="text-xl text-gray-600 mb-2">{getTodayDate()}</p>
          {allCompleted ? (
            <div className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-100 border-2 border-green-300 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-lg font-medium text-green-800">All activities completed today! 🎉</span>
            </div>
          ) : (
            <p className="text-lg text-gray-700 mt-4">
              Complete your daily activities to track your wellness journey
            </p>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 mx-auto ${
                completionStatus.surveyCompleted 
                  ? 'bg-green-100 border-4 border-green-500' 
                  : 'bg-gray-100 border-4 border-gray-300'
              }`}>
                <ClipboardList className={`w-10 h-10 ${
                  completionStatus.surveyCompleted ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <p className="font-medium text-gray-700">Mood Survey</p>
              <p className={`text-sm ${
                completionStatus.surveyCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {completionStatus.surveyCompleted ? 'Completed ✓' : 'Pending'}
              </p>
            </div>

            <div className="text-4xl text-gray-300">→</div>

            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 mx-auto ${
                completionStatus.cameraCompleted 
                  ? 'bg-green-100 border-4 border-green-500' 
                  : 'bg-gray-100 border-4 border-gray-300'
              }`}>
                <Camera className={`w-10 h-10 ${
                  completionStatus.cameraCompleted ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <p className="font-medium text-gray-700">Camera Check</p>
              <p className={`text-sm ${
                completionStatus.cameraCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {completionStatus.cameraCompleted ? 'Completed ✓' : 'Pending'}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((completionStatus.surveyCompleted ? 50 : 0) + (completionStatus.cameraCompleted ? 50 : 0))}%` 
                }}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">
              {(completionStatus.surveyCompleted ? 50 : 0) + (completionStatus.cameraCompleted ? 50 : 0)}% Complete
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Activity Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood Survey Card */}
        <Card className={`bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all ${
          completionStatus.surveyCompleted ? 'border-green-300' : 'border-blue-300'
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-blue-600" />
              </div>
              {completionStatus.surveyCompleted && (
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              )}
            </div>
            <CardTitle className="text-2xl">Daily Mood Survey</CardTitle>
            <CardDescription className="text-base">
              Share your feelings and wellness status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">What you'll answer:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>✓ Overall mood and emotions</li>
                  <li>✓ Energy and activity levels</li>
                  <li>✓ Sleep quality</li>
                  <li>✓ Stress and anxiety levels</li>
                  <li>✓ Physical wellness</li>
                </ul>
              </div>

              <p className="text-gray-600">
                Takes approximately 2-3 minutes. Your responses help track your wellness journey.
              </p>

              {completionStatus.surveyCompleted ? (
                <div className="space-y-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✓ Completed for today</p>
                    <p className="text-sm text-green-600 mt-1">
                      Completed at {completionStatus.surveyCompletedAt ? 
                        new Date(completionStatus.surveyCompletedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'earlier today'}
                    </p>
                  </div>
                  <Button 
                    onClick={onStartSurvey}
                    variant="outline"
                    className="w-full h-14 text-lg"
                  >
                    View or Retake Survey
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={onStartSurvey}
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Start Survey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Camera Mood Detection Card */}
        <Card className={`bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all ${
          completionStatus.cameraCompleted ? 'border-green-300' : 'border-green-300'
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <Camera className="w-8 h-8 text-green-600" />
              </div>
              {completionStatus.cameraCompleted && (
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              )}
            </div>
            <CardTitle className="text-2xl flex items-center gap-2">
              Camera Mood Detection
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </CardTitle>
            <CardDescription className="text-base">
              AI-powered facial expression analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">How it works:</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>✓ Uses advanced AI technology</li>
                  <li>✓ Analyzes facial expressions</li>
                  <li>✓ Detects emotional state</li>
                  <li>✓ 100% private and secure</li>
                  <li>✓ Takes just a few seconds</li>
                </ul>
              </div>

              <p className="text-gray-600">
                Simply look at your camera and our AI will detect your emotional state through facial analysis.
              </p>

              {completionStatus.cameraCompleted ? (
                <div className="space-y-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✓ Completed for today</p>
                    <p className="text-sm text-green-600 mt-1">
                      Completed at {completionStatus.cameraCompletedAt ? 
                        new Date(completionStatus.cameraCompletedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'earlier today'}
                    </p>
                  </div>
                  <Button 
                    onClick={onStartCamera}
                    variant="outline"
                    className="w-full h-14 text-lg"
                  >
                    Retake Photo
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={onStartCamera}
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  Open Camera
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900 flex items-center gap-2">
            💡 Daily Wellness Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">⏰ Best Time to Track</h4>
              <p className="text-sm text-purple-800">
                Complete your activities at the same time each day for consistent tracking and better insights.
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">🎯 Be Honest</h4>
              <p className="text-sm text-purple-800">
                Answer honestly about your feelings. This helps us provide better care and track your wellness accurately.
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">📊 Track Patterns</h4>
              <p className="text-sm text-purple-800">
                Regular tracking helps identify patterns in your mood and wellness over time.
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">👥 Share Results</h4>
              <p className="text-sm text-purple-800">
                Weekly reports are automatically sent to your guardian to keep them informed about your wellness.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
