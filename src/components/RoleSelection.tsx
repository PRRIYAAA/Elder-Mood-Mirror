import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, Heart, Stethoscope } from "lucide-react";

interface RoleSelectionProps {
  onBack: () => void;
  onSelectRole: (role: 'elder' | 'doctor') => void;
}

export function RoleSelection({ onBack, onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-green-700">Elder Mood Mirror</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-800 mb-4">
              Choose Your Role
            </h2>
            <p className="text-xl text-gray-600">
              How would you like to access the Elder Mood Mirror?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Elder Card - Prominent */}
            <Card 
              className="bg-white/90 shadow-2xl border-4 border-blue-400 hover:shadow-3xl hover:scale-105 transition-all cursor-pointer relative"
              onClick={() => onSelectRole('elder')}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Common
              </div>
              <CardHeader className="text-center pt-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2">I'm an Elder</CardTitle>
                <CardDescription className="text-lg">
                  Track my daily mood and wellness
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-6 space-y-3">
                  <h4 className="font-medium text-blue-900 mb-3">Features for you:</h4>
                  <div className="space-y-2 text-blue-800">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📝</span>
                      <span>Complete daily mood surveys</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📸</span>
                      <span>AI-powered camera mood detection</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📊</span>
                      <span>View your wellness trends</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">👨‍👩‍👧</span>
                      <span>Share reports with caregivers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">🔒</span>
                      <span>Secure and private tracking</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole('elder');
                  }}
                >
                  Continue as Elder
                </Button>
              </CardContent>
            </Card>

            {/* Doctor Card */}
            <Card 
              className="bg-white/90 shadow-xl border-2 border-green-300 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
              onClick={() => onSelectRole('doctor')}
            >
              <CardHeader className="text-center pt-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2">I'm a Doctor</CardTitle>
                <CardDescription className="text-lg">
                  Monitor and care for my patients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 rounded-lg p-6 space-y-3">
                  <h4 className="font-medium text-green-900 mb-3">Features for you:</h4>
                  <div className="space-y-2 text-green-800">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">👥</span>
                      <span>Manage multiple patients</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📈</span>
                      <span>View comprehensive health reports</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">🔔</span>
                      <span>Receive mood alerts and notifications</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">💬</span>
                      <span>Communicate with caregivers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📋</span>
                      <span>Track appointments and notes</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole('doctor');
                  }}
                >
                  Continue as Doctor
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm mb-2">
              Both roles have secure, encrypted access with privacy protection
            </p>
            <p className="text-xs text-gray-500">
              💡 Tip: If you already have an account, select your role to sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
