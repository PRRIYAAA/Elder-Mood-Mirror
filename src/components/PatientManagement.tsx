import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Search, 
  UserPlus, 
  Filter, 
  Eye,
  Download,
  MessageSquare,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Badge } from './ui/badge';

interface PatientManagementProps {
  onViewPatientDetail: (patientId: string) => void;
}

export function PatientManagement({ onViewPatientDetail }: PatientManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState([
    {
      id: '1',
      name: 'Mary Johnson',
      age: 72,
      gender: 'Female',
      conditions: ['Hypertension', 'Diabetes'],
      lastSurvey: '2 hours ago',
      moodStatus: 'anxious',
      adherence: 85,
      alerts: 2
    },
    {
      id: '2',
      name: 'Robert Smith',
      age: 68,
      gender: 'Male',
      conditions: ['Arthritis', 'Heart Disease'],
      lastSurvey: '1 day ago',
      moodStatus: 'calm',
      adherence: 65,
      alerts: 1
    },
    {
      id: '3',
      name: 'Linda Brown',
      age: 75,
      gender: 'Female',
      conditions: ['Dementia', 'Osteoporosis'],
      lastSurvey: '3 hours ago',
      moodStatus: 'happy',
      adherence: 95,
      alerts: 0
    },
    {
      id: '4',
      name: 'James Wilson',
      age: 70,
      gender: 'Male',
      conditions: ['COPD', 'Hypertension'],
      lastSurvey: '5 hours ago',
      moodStatus: 'sad',
      adherence: 78,
      alerts: 3
    },
    {
      id: '5',
      name: 'Patricia Davis',
      age: 69,
      gender: 'Female',
      conditions: ['Depression', 'Diabetes'],
      lastSurvey: '30 minutes ago',
      moodStatus: 'anxious',
      adherence: 88,
      alerts: 1
    },
    {
      id: '6',
      name: 'Michael Miller',
      age: 73,
      gender: 'Male',
      conditions: ['Parkinson\'s', 'Hypertension'],
      lastSurvey: '4 hours ago',
      moodStatus: 'calm',
      adherence: 92,
      alerts: 0
    }
  ]);

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
      case 'happy': return 'bg-green-100 text-green-800 border-green-300';
      case 'calm': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'anxious': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'sad': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return 'text-green-600';
    if (adherence >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.conditions.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">📊</span>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Sample Patient Data</h3>
            <p className="text-sm text-blue-800">
              You're viewing 6 sample patients with mock mood and medication data. Click on any patient card to see detailed profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <h2 className="text-4xl font-semibold text-gray-800 mb-2">
          👥 Patient Management
        </h2>
        <p className="text-xl text-gray-600">
          Monitor and manage all patients under your care
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card className="bg-white/90 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search patients by name or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button className="h-12 bg-gradient-to-r from-blue-600 to-blue-700">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </Button>
            <Button className="h-12 bg-gradient-to-r from-green-600 to-green-700">
              <UserPlus className="w-5 h-5 mr-2" />
              Add Patient
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-semibold text-blue-600">{patients.length}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-semibold text-orange-600">
                {patients.filter(p => p.alerts > 0).length}
              </p>
              <p className="text-sm text-gray-600">Need Attention</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-semibold text-green-600">
                {patients.filter(p => p.adherence >= 90).length}
              </p>
              <p className="text-sm text-gray-600">Excellent Adherence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => (
          <Card 
            key={patient.id}
            className="bg-white/90 border-2 border-blue-200 hover:shadow-xl transition-all"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-1">{patient.name}</CardTitle>
                    <CardDescription className="text-base">
                      {patient.age} years • {patient.gender}
                    </CardDescription>
                  </div>
                </div>
                {patient.alerts > 0 && (
                  <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">{patient.alerts}</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current Mood */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Mood:</span>
                <span className={`px-3 py-1 rounded-full border-2 font-medium ${getMoodColor(patient.moodStatus)}`}>
                  {getMoodEmoji(patient.moodStatus)} {patient.moodStatus}
                </span>
              </div>

              {/* Medical Conditions */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Medical Conditions:</p>
                <div className="flex flex-wrap gap-2">
                  {patient.conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Medication Adherence */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Medication Adherence:</span>
                  <span className={`font-semibold ${getAdherenceColor(patient.adherence)}`}>
                    {patient.adherence}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      patient.adherence >= 90 ? 'bg-green-600' :
                      patient.adherence >= 70 ? 'bg-orange-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${patient.adherence}%` }}
                  ></div>
                </div>
              </div>

              {/* Last Survey */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Survey:</span>
                <span className="text-gray-800 font-medium">{patient.lastSurvey}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => onViewPatientDetail(patient.id)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Trends
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPatients.length === 0 && (
        <Card className="bg-white/90">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No patients found matching your search</p>
            <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">Export Patient Data</CardTitle>
          <CardDescription>Download patient reports for clinical review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export as PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export as CSV
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Monthly Summary Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
