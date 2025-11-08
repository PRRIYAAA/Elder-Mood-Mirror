import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, ArrowRight, Smile, Frown, Meh } from "lucide-react";
import { Progress } from "./ui/progress";
import { saveMoodSurvey } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface MoodSurveyProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

const surveyQuestions = [
  {
    id: "breakfast",
    type: "radio",
    title: "Did you have breakfast?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "dinner",
    type: "radio",
    title: "Did you have dinner?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "exercise",
    type: "radio",
    title: "Did you do any exercise today?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "tablets",
    type: "radio",
    title: "Did you take your tablets today?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "correct_time_dose",
    type: "radio",
    title: "Was it the correct time and dose?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "sleep_quality",
    type: "radio",
    title: "Did you sleep well last night?",
    options: [
      { value: "good", label: "Good" },
      { value: "average", label: "Average" },
      { value: "poor", label: "Poor" }
    ]
  },
  {
    id: "overall_mood",
    type: "radio",
    title: "How is your mood today?",
    options: [
      { value: "happy", label: "Happy 😊" },
      { value: "calm", label: "Calm 😌" },
      { value: "anxious", label: "Anxious 😟" },
      { value: "sad", label: "Sad 😔" }
    ]
  },
  {
    id: "water_intake",
    type: "radio",
    title: "Did you drink enough water today?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "social_interaction",
    type: "radio",
    title: "Did you speak to someone today?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "energy_level",
    type: "radio",
    title: "How was your energy today?",
    options: [
      { value: "great", label: "Great" },
      { value: "normal", label: "Normal" },
      { value: "low", label: "Low" }
    ]
  },
  {
    id: "pain",
    type: "radio",
    title: "Any pain today?",
    options: [
      { value: "no_pain", label: "No Pain" },
      { value: "mild", label: "Mild" },
      { value: "moderate", label: "Moderate" }
    ]
  },
  {
    id: "additional_notes",
    type: "text",
    title: "Is there anything else you'd like to share about how you're feeling?",
    subtitle: "This is optional but can help your caregivers understand how you're doing",
    placeholder: "Share any concerns, good moments, or anything else on your mind..."
  }
];

export function MoodSurvey({ onBack, onComplete }: MoodSurveyProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeSurvey();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  const completeSurvey = () => {
    const surveyData = {
      ...answers,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };
    saveMoodSurvey(surveyData).then(() => {
      toast.success("Survey completed successfully!");
      onComplete(surveyData);
    }).catch((error) => {
      toast.error("Failed to save survey. Please try again.");
      console.error("Error saving survey:", error);
    });
  };

  const isCurrentAnswered = () => {
    const question = surveyQuestions[currentQuestion];
    return answers[question.id] !== undefined && answers[question.id] !== "";
  };

  const renderQuestion = () => {
    const question = surveyQuestions[currentQuestion];
    const currentAnswer = answers[question.id];

    switch (question.type) {
      case "emoji":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {question.options?.map((option) => (
                <Button
                  key={option.value}
                  variant={currentAnswer === option.value ? "default" : "outline"}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`h-16 justify-start space-x-4 ${
                    currentAnswer === option.value 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className={currentAnswer === option.value ? "text-white" : option.color}>
                    {option.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        );

      case "slider":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Slider
                value={[currentAnswer || 5]}
                onValueChange={(value) => handleAnswer(question.id, value[0])}
                max={question.max}
                min={question.min}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <div className="text-3xl text-blue-600 mb-2">
                  {currentAnswer || 5}/10
                </div>
                <div className="text-sm text-gray-600">
                  {question.subtitle}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Very Tired</span>
                <span>Very Energetic</span>
              </div>
            </div>
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={currentAnswer}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            <div className="space-y-3">
              {question.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case "text":
        return (
          <div className="space-y-4">
            <Textarea
              placeholder={question.placeholder}
              value={currentAnswer || ""}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="min-h-32 resize-none"
            />
            <p className="text-sm text-gray-500">{question.subtitle}</p>
          </div>
        );

      default:
        return null;
    }
  };

  const question = surveyQuestions[currentQuestion];

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={prevQuestion} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Daily Mood Survey</h2>
            <p className="text-sm text-gray-600 mt-1">
              Question {currentQuestion + 1} of {surveyQuestions.length}
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((currentQuestion + 1) / surveyQuestions.length * 100)}%</span>
          </div>
          <Progress value={(currentQuestion + 1) / surveyQuestions.length * 100} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-100">
          <h3 className="text-xl text-gray-800 text-center mb-6">
            {question.title}
          </h3>
          {question.subtitle && question.type !== "slider" && (
            <p className="text-sm text-gray-600 text-center mb-4">{question.subtitle}</p>
          )}
          
          {renderQuestion()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4 pt-4">
          <Button
            variant="outline"
            onClick={prevQuestion}
            size="lg"
            className="flex-1 h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentQuestion === 0 ? "Back" : "Previous"}
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={question.type !== "text" && !isCurrentAnswered()}
            size="lg"
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
          >
            {currentQuestion === surveyQuestions.length - 1 ? "Complete Survey" : "Next"}
            {currentQuestion < surveyQuestions.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}