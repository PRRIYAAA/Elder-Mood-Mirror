import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Archive, 
  Trash2, 
  Mail, 
  MoreVertical, 
  Star,
  Reply,
  Forward,
  Smile,
  BarChart3,
  Lightbulb
} from "lucide-react";

interface GmailInterfaceProps {
  onBack: () => void;
  userData: any;
}

export function GmailInterface({ onBack, userData }: GmailInterfaceProps) {
  const [isStarred, setIsStarred] = useState(false);

  // Mock email data based on the image
  const emailData = {
    subject: "Mood Report for sanjay",
    sender: "abishaeunice123@gmail.com",
    senderName: "Abishae Eunice",
    date: "12 Jul",
    recentDate: "13 Jul",
    preview: "Weekly Mood Report for sanjay Here's how your loved one felt recently: 🧠",
    content: {
      title: "Weekly Mood Report for sanjay",
      subtitle: "Here's how your loved one felt recently:",
      moodBreakdown: [
        { mood: "Anxious", count: 2, percentage: 4.8, color: "text-red-600" },
        { mood: "Calm", count: 3, percentage: 7.1, color: "text-blue-600" },
        { mood: "Happy", count: 11, percentage: 26.2, color: "text-green-600" },
        { mood: "Sad", count: 1, percentage: 2.4, color: "text-orange-600" },
        { mood: "Neutral", count: 25, percentage: 59.5, color: "text-gray-600" }
      ],
      dominantMood: "Neutral",
      suggestions: [
        "Encourage more social activities to boost mood",
        "Consider gentle exercise routines for better wellbeing", 
        "Maintain regular sleep schedule",
        "Check in more frequently during neutral mood periods"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white text-black text-sm">
        <span>11:00</span>
        <div className="flex items-center space-x-1">
          <span>🔇</span>
          <span>📶</span>
          <span>📶</span>
          <span>📱</span>
          <span>🔋47</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Archive className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mail className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Email Header */}
      <div className="p-4 bg-white border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-xl text-gray-800">{emailData.subject}</h1>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                Inbox
              </Badge>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsStarred(!isStarred)}
          >
            <Star className={`w-5 h-5 ${isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
          </Button>
        </div>

        {/* Sender Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">A</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-800">{emailData.sender}</span>
              <Badge variant="outline" className="text-xs">
                🔗 {emailData.date}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">{emailData.preview}</p>
          </div>
        </div>

        {/* Secondary sender info */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">A</span>
            </div>
            <div>
              <p className="text-sm text-gray-800">abishaeunic...</p>
              <p className="text-xs text-gray-600">to me ▼</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{emailData.recentDate}</span>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <Smile className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <Reply className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 p-4 bg-white overflow-y-auto">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl text-teal-600 mb-2">
              🧠 {emailData.content.title}
            </h2>
            <p className="text-gray-700">{emailData.content.subtitle}</p>
          </div>

          {/* Mood Breakdown */}
          <Card className="bg-pink-50 border-pink-200">
            <CardContent className="p-4">
              <h3 className="text-lg text-pink-700 mb-4 flex items-center space-x-2">
                <span>🧠</span>
                <span>Mood Breakdown:</span>
              </h3>
              <ul className="space-y-2">
                {emailData.content.moodBreakdown.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className={`${item.color}`}>
                      {item.mood}: {item.count} ({item.percentage}%)
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Dominant Mood */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-lg text-yellow-700 flex items-center space-x-2 mb-2">
              <span>⭐</span>
              <span>Dominant Mood: {emailData.content.dominantMood}</span>
            </h3>
          </div>

          {/* Suggestions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="text-lg text-blue-700 mb-4 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Suggestions:</span>
              </h3>
              <ul className="space-y-2">
                {emailData.content.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span className="text-blue-800">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 h-12 border-gray-300 text-gray-700"
          >
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-12 border-gray-300 text-gray-700"
          >
            <Forward className="w-4 h-4 mr-2" />
            Forward
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12">
            <Smile className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between p-4 bg-white border-t">
        <div className="relative">
          <Mail className="w-6 h-6 text-orange-600" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
            51
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <div className="w-6 h-6 border-2 border-gray-400"></div>
        </Button>
      </div>
    </div>
  );
}