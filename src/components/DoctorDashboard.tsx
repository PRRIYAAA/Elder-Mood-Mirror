import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  MessageSquare, 
  FileText,
  Bell,
  Activity,
  Plus,
  Search
} from 'lucide-react';
import { Input } from './ui/input';

interface DoctorDashboardProps {
  doctorData: any;
  onViewPatients: () => void;
  onViewAlerts: () => void;
  onViewMessages: () => void;
  onViewAnalytics: () => void;
}

export function DoctorDashboard({ 
  doctorData, 
  onViewPatients,
  onViewAlerts,
  onViewMessages,
  onViewAnalytics
}: DoctorDashboardProps) {
  const [stats, setStats] = useState({
    totalPatients: 12,
    activeAlerts: 3,
    upcomingAppointments: 5,
    unreadMessages: 7
  });

  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: 1,
      patientName: "Mary Johnson",
      severity: "high",
      message: "Persistent anxiety for 3 consecutive days",
      time: "2 hours ago"
    },
    {
      id: 2,
      patientName: "Robert Smith",
      severity: "medium",
      message: "Missed medication for 2 days",
      time: "5 hours ago"
    },
    {
      id: 3,
      patientName: "Linda Brown",
      severity: "low",
      message: "Slight mood improvement noted",
      time: "1 day ago"
    }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      patientName: "Mary Johnson",
      date: "Today",
      time: "2:00 PM",
      type: "Follow-up"
    },
    {
      id: 2,
      patientName: "Robert Smith",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "Consultation"
    },
    {
      id: 3,
      patientName: "Linda Brown",
      date: "Nov 10",
      time: "3:00 PM",
      type: "Check-up"
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 mb-1">Demo Mode - Using Sample Data</h3>
            <p className="text-sm text-purple-800">
              You're viewing the doctor portal with sample patient data. Full backend integration with real patient data is coming soon. 
              All UI features are functional for testing and demonstration purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-8 border-2 border-green-200">
        <h2 className="text-4xl font-semibold text-gray-800 mb-2">
          Welcome, Dr. {doctorData?.name || 'Doctor'} 👨‍⚕️
        </h2>
        <p className="text-xl text-gray-600">
          {doctorData?.specialty || 'Medical Professional'} • {doctorData?.hospital || 'Healthcare Provider'}
        </p>
        <p className="text-lg text-gray-500 mt-2">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white/90 border-2 border-blue-200 hover:shadow-lg transition-all cursor-pointer" onClick={onViewPatients}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                <p className="text-3xl font-semibold text-blue-600">{stats.totalPatients}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Under your care</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-2 border-red-200 hover:shadow-lg transition-all cursor-pointer" onClick={onViewAlerts}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Alerts</p>
                <p className="text-3xl font-semibold text-red-600">{stats.activeAlerts}</p>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <Bell className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Require attention</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Appointments</p>
                <p className="text-3xl font-semibold text-green-600">{stats.upcomingAppointments}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-7 h-7 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-2 border-purple-200 hover:shadow-lg transition-all cursor-pointer" onClick={onViewMessages}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Messages</p>
                <p className="text-3xl font-semibold text-purple-600">{stats.unreadMessages}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Unread</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card className="bg-white/90 border-2 border-orange-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <CardTitle>Recent Mood Alerts</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewAlerts}
              >
                View All
              </Button>
            </div>
            <CardDescription>Patient mood changes requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{alert.patientName}</p>
                      <p className="text-sm opacity-80 mt-1">{alert.message}</p>
                    </div>
                    <span className="text-xs opacity-60 whitespace-nowrap">{alert.time}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="bg-white/90 border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <CardTitle>Upcoming Appointments</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add New
              </Button>
            </div>
            <CardDescription>Scheduled patient consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="p-4 rounded-lg border-2 border-blue-100 bg-blue-50/50 hover:bg-blue-100/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-blue-900">{appointment.patientName}</p>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                      {appointment.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-blue-700">
                    <span>📅 {appointment.date}</span>
                    <span>🕐 {appointment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              className="h-20 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              onClick={onViewPatients}
            >
              <Users className="w-6 h-6 mr-2" />
              Manage Patients
            </Button>
            <Button 
              className="h-20 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              onClick={onViewAnalytics}
            >
              <TrendingUp className="w-6 h-6 mr-2" />
              View Analytics
            </Button>
            <Button 
              className="h-20 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              onClick={onViewMessages}
            >
              <MessageSquare className="w-6 h-6 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health Trends Overview */}
      <Card className="bg-white/90 border-2 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-600" />
            <CardTitle>Patient Health Trends</CardTitle>
          </div>
          <CardDescription>Overview of emotional and physical wellness changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-2xl font-semibold text-green-600">75%</p>
              <p className="text-sm text-gray-600 mt-1">Overall Improvement</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-4xl mb-2">😊</div>
              <p className="text-2xl font-semibold text-blue-600">8/12</p>
              <p className="text-sm text-gray-600 mt-1">Positive Mood</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-4xl mb-2">💊</div>
              <p className="text-2xl font-semibold text-orange-600">92%</p>
              <p className="text-sm text-gray-600 mt-1">Medication Adherence</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}