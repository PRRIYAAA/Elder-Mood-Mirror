import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Sparkles, Users } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo/App Icon */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-green-700">Elder Mood Mirror</h1>
          <p className="text-gray-600 text-center px-4">Your daily companion for emotional wellness and health monitoring</p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          <Card className="p-4 bg-white/80 border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-blue-700 mb-1">Daily Mood Tracking</h3>
                <p className="text-sm text-gray-600">Monitor your emotional well-being through surveys and camera detection</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-green-700 mb-1">Family Connection</h3>
                <p className="text-sm text-gray-600">Weekly reports sent to your loved ones to keep them informed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Hero Image */}
        <div className="text-center">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1619165915846-43d3b9445823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGVyc29uJTIwc21pbGluZyUyMGhhcHB5fGVufDF8fHx8MTc1NzMyNDE1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
            alt="Happy elderly person" 
            className="w-48 h-48 object-cover rounded-full mx-auto shadow-lg border-4 border-white"
          />
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={onGetStarted}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl shadow-lg"
        >
          Get Started
        </Button>

        <p className="text-center text-sm text-gray-500">
          Simple • Safe • Caring
        </p>
      </div>
    </div>
  );
}