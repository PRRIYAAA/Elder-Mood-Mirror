import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import { signUp, signIn } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface AuthScreenProps {
  onBack: () => void;
  onLogin: (data: any) => void;
  onSignUpComplete: (data: any) => void;
  role: 'elder' | 'doctor';
}

export function AuthScreen({ onBack, onLogin, onSignUpComplete, role }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExistingUserHint, setShowExistingUserHint] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }

        // Call backend signup
        try {
          const result = await signUp(
            formData.email,
            formData.password,
            formData.name,
            formData.phone
          );

          if (result.success) {
            toast.success("Account created successfully!");
            onSignUpComplete({ 
              email: formData.email, 
              name: formData.name, 
              phone: formData.phone,
              userId: result.userId
            });
          }
        } catch (signupError: any) {
          // If user already exists, suggest logging in instead
          if (signupError.message?.includes('already been registered')) {
            toast.error("This email is already registered. Please sign in instead.", {
              duration: 5000
            });
            // Show the hint and automatically switch to sign in mode
            setShowExistingUserHint(true);
            setTimeout(() => {
              setIsSignUp(false);
              setShowExistingUserHint(false);
            }, 2000);
          } else {
            throw signupError;
          }
        }
      } else {
        // Call backend login
        const result = await signIn(formData.email, formData.password);

        if (result.success) {
          toast.success("Welcome back!");
          onLogin({ 
            email: formData.email,
            user: result.user 
          });
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-green-700">Elder Mood Mirror</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-white/90 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-gray-800">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <p className="text-gray-600">
              {isSignUp ? "Let's set up your account" : "Sign in to continue"}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800">
                {role === 'elder' ? '👤 Creating Elder Account' : '👨‍⚕️ Creating Doctor Account'}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : (isSignUp ? "Create Account" : "Sign In")}
              </Button>
            </form>

            <div className="text-center">
              {showExistingUserHint && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    ℹ️ Switching you to Sign In...
                  </p>
                </div>
              )}
              <Button
                variant="link"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setShowExistingUserHint(false);
                }}
                className="text-gray-600"
              >
                {isSignUp 
                  ? "Already have an account? Sign In" 
                  : "Don't have an account? Sign Up"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}