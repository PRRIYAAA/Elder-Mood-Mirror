import { Button } from './ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl mb-6 shadow-lg">
            <span className="text-5xl">🧠</span>
          </div>
          <h1 className="text-5xl mb-4 text-gray-800">
            Elder Mood Mirror
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Reflecting Care, Restoring Smiles
          </p>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A compassionate companion designed to help families and caregivers understand the emotional well-being of elderly loved ones.
            Elder Mood Mirror uses gentle daily reflections and smart emotion analysis to detect mood changes, encourage healthy routines, and promote mental wellness in seniors.
          </p>
        </div>

        {/* Why Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl mb-6 text-gray-800 flex items-center gap-3">
            💙 Why Elder Mood Mirror?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌞</span>
              <p className="text-xl text-gray-700 pt-1">Encourages positive daily engagement</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧩</span>
              <p className="text-xl text-gray-700 pt-1">Tracks emotional patterns over time</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">👩‍⚕️</span>
              <p className="text-xl text-gray-700 pt-1">Helps families and caregivers stay informed</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <p className="text-xl text-gray-700 pt-1">Secure and private – your data stays safe</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌿</span>
              <p className="text-xl text-gray-700 pt-1">Designed with comfort, clarity, and simplicity for seniors</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl mb-6 text-gray-800 flex items-center gap-3">
            💬 How It Works
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl mb-2 text-gray-800">Daily Mood Check-ins:</h3>
              <p className="text-lg text-gray-700">Simple and friendly mood surveys or facial emotion detection.</p>
            </div>
            <div>
              <h3 className="text-xl mb-2 text-gray-800">Smart Insights:</h3>
              <p className="text-lg text-gray-700">AI helps identify trends and early signs of distress or happiness.</p>
            </div>
            <div>
              <h3 className="text-xl mb-2 text-gray-800">Connected Care:</h3>
              <p className="text-lg text-gray-700">Families and caregivers receive meaningful insights, not just numbers.</p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl mb-6 text-gray-800 flex items-center gap-3">
            🕊️ Our Mission
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            To nurture emotional well-being in the elderly through technology that understands, listens, and cares — making every day a little brighter.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-8 text-2xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600">
          <p className="text-lg">Start your journey to better emotional wellness today</p>
        </div>
      </div>
    </div>
  );
}
