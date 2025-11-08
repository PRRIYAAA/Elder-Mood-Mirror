import { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { ElderInfoForm } from './components/ElderInfoForm';
import { DoctorInfoForm } from './components/DoctorInfoForm';
import { Dashboard } from './components/Dashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { MoodSurvey } from './components/MoodSurvey';
import { CameraMoodDetection } from './components/CameraMoodDetection';
import { Navigation } from './components/Navigation';
import { DoctorNavigation } from './components/DoctorNavigation';
import { DailySurveyPage } from './components/DailySurveyPage';
import { WeeklyAnalytics } from './components/WeeklyAnalytics';
import { ReportsPage } from './components/ReportsPage';
import { PatientManagement } from './components/PatientManagement';
import { PatientDetailView } from './components/PatientDetailView';
import { LandingPage } from './components/LandingPage';
import { RoleSelection } from './components/RoleSelection';
import { ComingSoonPage } from './components/ComingSoonPage';
import { GuardianChat } from './components/GuardianChat';
import { EditProfileDialog } from './components/EditProfileDialog';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Edit } from 'lucide-react';
import { supabase, getCurrentUser, getElderInfo, getDoctorInfo, getUserProfile } from './utils/api';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'roleSelection' | 'auth' | 'elderInfo' | 'doctorInfo' | 'main'>('landing');
  const [selectedRole, setSelectedRole] = useState<'elder' | 'doctor' | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'survey' | 'analytics' | 'reports' | 'patients' | 'patient-detail' | 'alerts' | 'messages' | 'mood-survey' | 'camera'>('dashboard');
  const [userData, setUserData] = useState<any>(null);
  const [elderData, setElderData] = useState<any>(null);
  const [doctorData, setDoctorData] = useState<any>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setUserData({ email: user.email, user });
        
        // Check user profile to determine if they have completed setup
        try {
          const profileResponse = await getUserProfile();
          
          if (profileResponse.success && profileResponse.hasProfile && profileResponse.role) {
            // User has a profile - load it and go to main screen
            if (profileResponse.role === 'elder') {
              setElderData(profileResponse.profile);
              setSelectedRole('elder');
            } else if (profileResponse.role === 'doctor') {
              setDoctorData(profileResponse.profile);
              setSelectedRole('doctor');
            }
            setCurrentScreen('main');
            setIsLoading(false);
            return;
          }
        } catch (profileError) {
          console.log('Profile check error:', profileError);
        }

        // No profile found - user needs to select a role and complete setup
        // Go back to role selection
        setCurrentScreen('roleSelection');
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (data: any) => {
    setUserData(data);
    // Check if profile exists based on selected role
    if (selectedRole === 'elder') {
      checkElderInfoAfterLogin();
    } else if (selectedRole === 'doctor') {
      checkDoctorInfoAfterLogin();
    }
  };

  const checkElderInfoAfterLogin = async () => {
    try {
      const elderInfoResponse = await getElderInfo();
      if (elderInfoResponse.success && elderInfoResponse.elderInfo) {
        setElderData(elderInfoResponse.elderInfo);
        setCurrentScreen('main');
      } else {
        setCurrentScreen('elderInfo');
      }
    } catch (error: any) {
      console.log('Elder info not found, redirecting to setup:', error.message);
      setCurrentScreen('elderInfo');
    }
  };

  const checkDoctorInfoAfterLogin = async () => {
    try {
      const doctorInfoResponse = await getDoctorInfo();
      if (doctorInfoResponse.success && doctorInfoResponse.doctorInfo) {
        setDoctorData(doctorInfoResponse.doctorInfo);
        setCurrentScreen('main');
      } else {
        setCurrentScreen('doctorInfo');
      }
    } catch (error: any) {
      console.log('Doctor info not found, redirecting to setup:', error.message);
      setCurrentScreen('doctorInfo');
    }
  };

  const handleSignUpComplete = (data: any) => {
    setUserData(data);
    if (selectedRole === 'elder') {
      setCurrentScreen('elderInfo');
    } else if (selectedRole === 'doctor') {
      setCurrentScreen('doctorInfo');
    }
  };

  const handleElderInfoComplete = (data: any) => {
    setElderData(data);
    setSelectedRole('elder');
    setCurrentScreen('main');
  };

  const handleDoctorInfoComplete = (data: any) => {
    setDoctorData(data);
    setSelectedRole('doctor');
    setCurrentScreen('main');
  };

  const handleElderDataUpdate = async (data: any) => {
    setElderData(data);
    // Optionally refresh elder info from backend to ensure consistency
    try {
      const elderInfoResponse = await getElderInfo();
      if (elderInfoResponse.success && elderInfoResponse.elderInfo) {
        setElderData(elderInfoResponse.elderInfo);
      }
    } catch (error) {
      console.error('Error refreshing elder info:', error);
    }
  };

  const handleDoctorDataUpdate = async (data: any) => {
    setDoctorData(data);
    // Optionally refresh doctor info from backend to ensure consistency
    try {
      const doctorInfoResponse = await getDoctorInfo();
      if (doctorInfoResponse.success && doctorInfoResponse.doctorInfo) {
        setDoctorData(doctorInfoResponse.doctorInfo);
      }
    } catch (error) {
      console.error('Error refreshing doctor info:', error);
    }
  };

  const handleStartSurvey = () => {
    setCurrentPage('mood-survey');
  };

  const handleStartCamera = () => {
    setCurrentPage('camera');
  };

  const handleSurveyComplete = () => {
    setCurrentPage('survey');
  };

  const handleCameraComplete = () => {
    setCurrentPage('survey');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('survey');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      <Toaster position="top-center" />
      
      {/* Web App Header */}
      {currentScreen !== 'landing' && currentScreen !== 'auth' && currentScreen !== 'elderInfo' && currentScreen !== 'doctorInfo' && (
        <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🌲</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Elder Mood Mirror</h1>
                  <p className="text-sm text-gray-500">Your daily wellness companion</p>
                </div>
              </div>
              {userData && (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{userData.name || userData.email}</p>
                    <button 
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setCurrentScreen('auth');
                        setUserData(null);
                        setElderData(null);
                        setDoctorData(null);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Navigation */}
      {currentScreen === 'main' && (
        <>
          {selectedRole === 'elder' && (
            <Navigation
              currentPage={currentPage}
              onNavigate={(page) => setCurrentPage(page as any)}
            />
          )}
          {selectedRole === 'doctor' && (
            <DoctorNavigation
              currentPage={currentPage}
              onNavigate={(page) => setCurrentPage(page as any)}
            />
          )}
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentScreen === 'landing' && (
          <LandingPage onGetStarted={() => setCurrentScreen('roleSelection')} />
        )}

        {currentScreen === 'roleSelection' && (
          <RoleSelection
            onBack={() => setCurrentScreen('landing')}
            onSelectRole={(role) => {
              setSelectedRole(role);
              setCurrentScreen('auth');
            }}
          />
        )}

        {currentScreen === 'auth' && (
          <div className="max-w-md mx-auto">
            <AuthScreen 
              onBack={() => setCurrentScreen('roleSelection')}
              onLogin={handleLogin}
              onSignUpComplete={handleSignUpComplete}
              role={selectedRole!}
            />
          </div>
        )}

        {currentScreen === 'elderInfo' && (
          <div className="max-w-3xl mx-auto">
            <ElderInfoForm
              onBack={() => {
                supabase.auth.signOut();
                setCurrentScreen('auth');
              }}
              onComplete={handleElderInfoComplete}
            />
          </div>
        )}

        {currentScreen === 'doctorInfo' && (
          <div className="max-w-3xl mx-auto">
            <DoctorInfoForm
              onBack={() => {
                supabase.auth.signOut();
                setCurrentScreen('auth');
              }}
              onComplete={handleDoctorInfoComplete}
            />
          </div>
        )}

        {currentScreen === 'main' && (
          <>
            {currentPage === 'dashboard' && (
              <>
                {selectedRole === 'elder' && (
                  <Dashboard
                    userData={userData}
                    elderData={elderData}
                    onStartSurvey={handleStartSurvey}
                    onStartCamera={handleStartCamera}
                    onElderDataUpdate={handleElderDataUpdate}
                  />
                )}
                {selectedRole === 'doctor' && (
                  <DoctorDashboard
                    doctorData={doctorData}
                    onViewPatients={() => setCurrentPage('patients')}
                    onViewAlerts={() => setCurrentPage('alerts')}
                    onViewMessages={() => setCurrentPage('messages')}
                    onViewAnalytics={() => setCurrentPage('analytics')}
                  />
                )}
              </>
            )}

            {currentPage === 'survey' && (
              <DailySurveyPage
                onStartSurvey={handleStartSurvey}
                onStartCamera={handleStartCamera}
              />
            )}

            {currentPage === 'analytics' && (
              <WeeklyAnalytics
                elderData={elderData}
              />
            )}

            {currentPage === 'reports' && (
              <ReportsPage
                elderData={elderData}
              />
            )}

            {currentPage === 'patients' && (
              <PatientManagement
                onViewPatientDetail={(patientId) => {
                  setSelectedPatientId(patientId);
                  setCurrentPage('patient-detail');
                }}
              />
            )}

            {currentPage === 'patient-detail' && (
              <PatientDetailView
                patientId={selectedPatientId}
                onBack={() => setCurrentPage('patients')}
              />
            )}

            {currentPage === 'alerts' && (
              <ComingSoonPage
                title="Alert Management"
                description="Real-time mood alerts and notifications are coming soon!"
                onBack={() => setCurrentPage('dashboard')}
              />
            )}

            {currentPage === 'messages' && selectedRole === 'doctor' && (
              <GuardianChat
                doctorData={doctorData}
                onBack={() => setCurrentPage('dashboard')}
              />
            )}

            {currentPage === 'mood-survey' && (
              <div className="max-w-3xl mx-auto">
                <MoodSurvey
                  onComplete={handleSurveyComplete}
                  onBack={handleBackToDashboard}
                />
              </div>
            )}

            {currentPage === 'camera' && (
              <div className="max-w-4xl mx-auto">
                <CameraMoodDetection
                  onComplete={handleCameraComplete}
                  onBack={handleBackToDashboard}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Profile Dialog */}
      {currentScreen === 'main' && (
        <EditProfileDialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          role={selectedRole!}
          currentData={selectedRole === 'elder' ? elderData : doctorData}
          onSave={selectedRole === 'elder' ? handleElderDataUpdate : handleDoctorDataUpdate}
        />
      )}
    </div>
  );
}

export default App;