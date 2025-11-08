import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  User, 
  Heart, 
  Activity, 
  Calendar,
  MessageSquare,
  FileText,
  Download,
  AlertTriangle,
  Pill,
  TrendingUp
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface PatientDetailViewProps {
  patientId: string;
  onBack: () => void;
}

export function PatientDetailView({ patientId, onBack }: PatientDetailViewProps) {
  const [newNote, setNewNote] = useState('');

  // Mock patient data
  const patient = {
    id: patientId,
    name: 'Mary Johnson',
    age: 72,
    gender: 'Female',
    email: 'mary.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Oak Street, Springfield, IL 62701',
    guardianName: 'Sarah Johnson',
    guardianEmail: 'sarah.johnson@email.com',
    guardianPhone: '+1 (555) 987-6543',
    conditions: ['Hypertension', 'Diabetes Type 2', 'Mild Anxiety'],
    disabilities: ['Mobility Issues'],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', time: '8:00 AM' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '8:00 AM, 8:00 PM' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', time: '8:00 AM' }
    ],
    recentMoods: [
      { date: 'Nov 8', mood: 'anxious', emoji: '😟' },
      { date: 'Nov 7', mood: 'calm', emoji: '😌' },
      { date: 'Nov 6', mood: 'anxious', emoji: '😟' },
      { date: 'Nov 5', mood: 'anxious', emoji: '😟' },
      { date: 'Nov 4', mood: 'happy', emoji: '😊' },
    ],
    weeklyStats: {
      surveyCompletion: 85,
      cameraCompletion: 90,
      medicationAdherence: 85,
      averageMood: 'Anxious (trending)'
    },
    notes: [
      {
        id: 1,
        date: 'Nov 7, 2025',
        doctor: 'Dr. Smith',
        content: 'Patient reports increased anxiety levels. Recommended follow-up in 2 weeks. Consider adjusting medication if symptoms persist.'
      },
      {
        id: 2,
        date: 'Oct 15, 2025',
        doctor: 'Dr. Smith',
        content: 'Regular checkup. Blood pressure stable. Patient doing well with current medication regimen.'
      }
    ],
    upcomingAppointments: [
      { date: 'Nov 10, 2025', time: '2:00 PM', type: 'Follow-up Consultation' },
      { date: 'Nov 24, 2025', time: '10:00 AM', type: 'Routine Check-up' }
    ]
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'anxious': return '😟';
      case 'sad': return '😔';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 text-green-800';
      case 'calm': return 'bg-blue-100 text-blue-800';
      case 'anxious': return 'bg-orange-100 text-orange-800';
      case 'sad': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h2 className="text-4xl font-semibold text-gray-800">Patient Profile</h2>
          <p className="text-gray-600">Comprehensive health and wellness overview</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-green-700">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Patient Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl">
                {patient.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">{patient.name}</CardTitle>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <span>👤 {patient.age} years • {patient.gender}</span>
                  <span>📧 {patient.email}</span>
                  <span>📱 {patient.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <MessageSquare className="w-5 h-5 mr-2" />
                Message Guardian
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="font-medium">{patient.address}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Guardian Contact</p>
              <p className="font-medium">{patient.guardianName}</p>
              <p className="text-sm text-gray-600">{patient.guardianEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mood">Mood Trends</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Weekly Stats */}
          <Card className="bg-white/90 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Weekly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-semibold text-blue-600">{patient.weeklyStats.surveyCompletion}%</p>
                  <p className="text-sm text-gray-600 mt-1">Survey Completion</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-semibold text-green-600">{patient.weeklyStats.cameraCompletion}%</p>
                  <p className="text-sm text-gray-600 mt-1">Camera Check-ins</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-semibold text-purple-600">{patient.weeklyStats.medicationAdherence}%</p>
                  <p className="text-sm text-gray-600 mt-1">Medication Adherence</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl mb-1">😟</div>
                  <p className="text-sm text-gray-600 mt-1">{patient.weeklyStats.averageMood}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/90 border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-orange-600" />
                  Medical Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                      <span className="text-orange-600">•</span>
                      <span className="font-medium text-gray-800">{condition}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-purple-600" />
                  Disabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.disabilities.map((disability, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-600">•</span>
                      <span className="font-medium text-gray-800">{disability}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Banner if needed */}
          <Card className="bg-red-50 border-2 border-red-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Attention Required</h3>
                  <p className="text-red-800">
                    Patient has shown persistent anxiety for 3 consecutive days. Consider scheduling a 
                    follow-up consultation or adjusting current treatment plan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mood Trends Tab */}
        <TabsContent value="mood" className="space-y-6">
          <Card className="bg-white/90 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Recent Mood History
              </CardTitle>
              <CardDescription>Last 7 days of mood tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patient.recentMoods.map((entry, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg ${getMoodColor(entry.mood)} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{entry.emoji}</span>
                      <div>
                        <p className="font-medium capitalize">{entry.mood}</p>
                        <p className="text-sm opacity-75">{entry.date}</p>
                      </div>
                    </div>
                    {index < 3 && entry.mood === 'anxious' && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                        Concerning Pattern
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-6">
          <Card className="bg-white/90 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-6 h-6 text-green-600" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.medications.map((med, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-green-900">{med.name}</h4>
                        <p className="text-sm text-green-700">{med.dosage}</p>
                      </div>
                      <Badge className="bg-green-200 text-green-800">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-green-800 mt-2">
                      <div>
                        <span className="font-medium">Frequency:</span> {med.frequency}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {med.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <Card className="bg-white/90 border-2 border-purple-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  Upcoming Appointments
                </CardTitle>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
                  Schedule New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patient.upcomingAppointments.map((apt, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-purple-900">{apt.type}</p>
                        <p className="text-sm text-purple-700 mt-1">
                          📅 {apt.date} at {apt.time}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          {/* Add New Note */}
          <Card className="bg-white/90 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Add Consultation Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your consultation notes here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-32 text-lg mb-4"
              />
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                Save Note
              </Button>
            </CardContent>
          </Card>

          {/* Previous Notes */}
          <Card className="bg-white/90 border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Previous Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{note.doctor}</p>
                        <p className="text-sm text-gray-600">{note.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-800 mt-2">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
