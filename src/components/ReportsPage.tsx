import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { FileText, Mail, Download, Calendar, User, Heart, Activity, TrendingUp, Send, CheckCircle, FileDown } from 'lucide-react';
import { getWeeklyReport, sendWeeklyReport } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { downloadReportAsPDF, downloadReportAsCSV } from '../utils/reportDownload';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ReportsPageProps {
  elderData: any;
}

export function ReportsPage({ elderData }: ReportsPageProps) {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadWeeklyReport();
  }, []);

  const loadWeeklyReport = async () => {
    setIsLoading(true);
    try {
      const response = await getWeeklyReport();
      if (response.success) {
        setReportData(response.reportData);
      }
    } catch (error) {
      console.error('Error loading weekly report:', error);
      toast.error('Failed to load weekly report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReport = async () => {
    setIsSending(true);
    try {
      const response = await sendWeeklyReport();
      if (response.success) {
        toast.success(response.message || 'Weekly report sent successfully!');
      } else {
        toast.error(response.error || 'Failed to send weekly report');
      }
    } catch (error: any) {
      console.error('Error sending report:', error);
      toast.error(error.message || 'Failed to send weekly report');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      downloadReportAsPDF(reportData, elderData);
      toast.success('Opening print dialog...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download PDF');
    }
  };

  const handleDownloadCSV = () => {
    try {
      downloadReportAsCSV(reportData, elderData);
      toast.success('Report downloaded as CSV');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download CSV');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No report data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = reportData.statistics || {};

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              📄 Weekly Report
            </h2>
            <p className="text-lg text-gray-600">
              {reportData.weekStart && reportData.weekEnd && (
                <>
                  {new Date(reportData.weekStart).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })} - {new Date(reportData.weekEnd).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 h-12 px-6"
                >
                  <FileDown className="w-5 h-5" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadCSV}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Download as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              onClick={handleSendReport}
              disabled={isSending}
              className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-blue-600 to-green-600"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send to Guardian
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Report Recipient Info */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Mail className="w-6 h-6" />
            Report Recipient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Guardian Name</p>
              <p className="text-lg font-medium text-gray-800">
                {reportData.guardianName || elderData?.guardianName || 'Not set'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Guardian Email</p>
              <p className="text-lg font-medium text-gray-800">
                {reportData.guardianEmail || elderData?.guardianEmail || 'Not set'}
              </p>
            </div>
          </div>
          {(!reportData.guardianEmail && !elderData?.guardianEmail) && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Guardian email not set. Please update your profile to enable automatic report sending.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Surveys Completed</p>
              <p className="text-4xl font-bold text-gray-800">{stats.surveysCompleted || 0}</p>
              <p className="text-xs text-gray-500 mt-1">out of 7 days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Camera Checks</p>
              <p className="text-4xl font-bold text-gray-800">{stats.cameraMoodsCompleted || 0}</p>
              <p className="text-xs text-gray-500 mt-1">out of 7 days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-4xl font-bold text-gray-800">{stats.completionRate || 0}%</p>
              <p className="text-xs text-gray-500 mt-1">overall progress</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-7 h-7 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Avg Energy Level</p>
              <p className="text-4xl font-bold text-gray-800">{stats.averageEnergyLevel || 0}</p>
              <p className="text-xs text-gray-500 mt-1">out of 10</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood Summary */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-600" />
              Mood Summary
            </CardTitle>
            <CardDescription>Overall emotional wellness this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Survey Mood Pattern</p>
                <p className="text-2xl font-semibold text-blue-900 capitalize">
                  {stats.dominantMood || 'No data'}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Camera Detected Mood</p>
                <p className="text-2xl font-semibold text-green-900 capitalize">
                  {stats.dominantCameraMood || 'No data'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Overview */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Health Overview
            </CardTitle>
            <CardDescription>Personal health information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Age</span>
                <span className="font-medium">{elderData?.age || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Blood Group</span>
                <span className="font-medium">{elderData?.bloodGroup || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Medical Conditions</span>
                <span className="font-medium">
                  {elderData?.medicalConditions?.length || 0} listed
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Current Medications</span>
                <span className="font-medium">
                  {elderData?.tabletName ? 'Active' : 'None'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activities Log */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            Weekly Activities Log
          </CardTitle>
          <CardDescription>Detailed breakdown of daily activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.surveys && reportData.surveys.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-gray-700">Survey</th>
                      <th className="text-left py-3 px-4 text-gray-700">Camera</th>
                      <th className="text-left py-3 px-4 text-gray-700">Mood</th>
                      <th className="text-left py-3 px-4 text-gray-700">Energy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (6 - i));
                      const dateStr = date.toISOString().split('T')[0];
                      
                      const survey = reportData.surveys.find((s: any) => s.date === dateStr);
                      const camera = reportData.cameraMoods?.find((c: any) => c.date === dateStr);
                      
                      return (
                        <tr key={dateStr} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {date.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="py-3 px-4">
                            {survey ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                                ✓ Done
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                                - Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {camera ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                                ✓ Done
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                                - Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 capitalize">
                            {survey?.overall_mood ? (
                              <span className="font-medium">{survey.overall_mood.replace('_', ' ')}</span>
                            ) : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {survey?.energy_level ? (
                              <span className="font-medium">{survey.energy_level}/10</span>
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No activity data available for this week</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Notes */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📋 Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-blue-900">
            <p>
              This weekly report provides a comprehensive overview of {reportData.elderName || 'the elder'}'s 
              mood and wellness tracking activities. The report includes daily survey responses, 
              camera-based mood detection results, and key health metrics.
            </p>
            <p>
              <strong>Tracking Consistency:</strong> {stats.completionRate}% of activities were completed 
              this week, demonstrating {
                parseInt(stats.completionRate) >= 80 ? 'excellent' :
                parseInt(stats.completionRate) >= 60 ? 'good' : 'moderate'
              } engagement with the wellness tracking program.
            </p>
            <p>
              <strong>Next Steps:</strong> Continue daily tracking for better trend analysis. 
              Guardian will receive automated weekly email reports for ongoing monitoring and care coordination.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}