import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Construction, ArrowLeft } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description: string;
  onBack: () => void;
}

export function ComingSoonPage({ title, description, onBack }: ComingSoonPageProps) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </Button>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader className="text-center pt-12 pb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-4xl mb-4">{title}</CardTitle>
          <CardDescription className="text-xl text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-12">
          <div className="bg-white/60 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">What's Available Now:</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-3">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Doctor Dashboard with patient overview</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Patient Management System</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Detailed Patient Profiles</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Mock Data for Testing</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              onClick={onBack}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              size="lg"
            >
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
