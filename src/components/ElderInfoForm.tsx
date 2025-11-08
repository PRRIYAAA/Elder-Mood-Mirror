import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, ArrowRight, User, Heart, Mail, Pill } from "lucide-react";
import { Progress } from "./ui/progress";
import { saveElderInfo } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface ElderInfoFormProps {
  onBack: () => void;
  onComplete: (data: any) => void;
  initialData?: any;
}

export function ElderInfoForm({ onBack, onComplete, initialData }: ElderInfoFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    age: initialData?.age || "",
    gender: initialData?.gender || "",
    bloodGroup: initialData?.bloodGroup || "",
    disability: initialData?.disability || "None",
    
    // Medical Information
    medicalConditions: initialData?.medicalConditions || [],
    otherConditions: initialData?.otherConditions || "",
    currentMedications: initialData?.currentMedications || "",
    
    // Medication Details
    tabletName: initialData?.tabletName || "",
    tabletFrequency: initialData?.tabletFrequency || "",
    medicationNotes: initialData?.medicationNotes || "",
    
    // Contact Information
    guardianName: initialData?.guardianName || "",
    guardianEmail: initialData?.guardianEmail || "",
    guardianPhone: initialData?.guardianPhone || "",
    clinicEmail: initialData?.clinicEmail || "",
    emergencyContact: initialData?.emergencyContact || ""
  });

  const steps = [
    { title: "Personal Info", icon: User },
    { title: "Health Details", icon: Heart },
    { title: "Medications", icon: Pill },
    { title: "Contacts", icon: Mail }
  ];

  const medicalConditionsList = [
    "High Blood Pressure (BP)",
    "Diabetes",
    "Heart Disease",
    "Asthma",
    "Arthritis",
    "Depression",
    "Anxiety",
    "Dementia/Alzheimer's",
    "Osteoporosis",
    "COPD"
  ];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateMedicalConditions = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: checked 
        ? [...prev.medicalConditions, condition]
        : prev.medicalConditions.filter(c => c !== condition)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      saveElderInfo(formData)
        .then(() => {
          toast.success("Elder information saved successfully!");
          onComplete(formData);
        })
        .catch((error) => {
          toast.error("Failed to save elder information. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Select value={formData.age} onValueChange={(value) => updateField("age", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 41 }, (_, i) => i + 60).map((age) => (
                    <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select value={formData.bloodGroup} onValueChange={(value) => updateField("bloodGroup", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your blood group" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disability">Disability Status</Label>
              <Select value={formData.disability} onValueChange={(value) => updateField("disability", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select disability status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Mobility">Mobility</SelectItem>
                  <SelectItem value="Vision">Vision</SelectItem>
                  <SelectItem value="Hearing">Hearing</SelectItem>
                  <SelectItem value="Cognitive">Cognitive</SelectItem>
                  <SelectItem value="Multiple">Multiple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1: // Health Details
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Medical Conditions (Select all that apply)</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {medicalConditionsList.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2 p-2 rounded-lg border">
                    <Checkbox
                      id={condition}
                      checked={formData.medicalConditions.includes(condition)}
                      onCheckedChange={(checked) => updateMedicalConditions(condition, checked as boolean)}
                    />
                    <label htmlFor={condition} className="text-sm flex-1">
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherConditions">Other Medical Conditions</Label>
              <Textarea
                id="otherConditions"
                placeholder="Please describe any other medical conditions..."
                value={formData.otherConditions}
                onChange={(e) => updateField("otherConditions", e.target.value)}
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                placeholder="List your current medications and dosages..."
                value={formData.currentMedications}
                onChange={(e) => updateField("currentMedications", e.target.value)}
                className="min-h-20"
              />
            </div>
          </div>
        );

      case 2: // Medications
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tabletName">Primary Medication Name</Label>
              <Input
                id="tabletName"
                placeholder="e.g., Paracetamol"
                value={formData.tabletName}
                onChange={(e) => updateField("tabletName", e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tabletFrequency">Medication Frequency</Label>
              <Select value={formData.tabletFrequency} onValueChange={(value) => updateField("tabletFrequency", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="How often do you take this medication?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once a day">Once a day</SelectItem>
                  <SelectItem value="Twice a day">Twice a day</SelectItem>
                  <SelectItem value="Three times a day">Three times a day</SelectItem>
                  <SelectItem value="Four times a day">Four times a day</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicationNotes">Medication Notes</Label>
              <Textarea
                id="medicationNotes"
                placeholder="Any special instructions for taking medications..."
                value={formData.medicationNotes}
                onChange={(e) => updateField("medicationNotes", e.target.value)}
                className="min-h-20"
              />
            </div>
          </div>
        );

      case 3: // Contact Information
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guardianName">Guardian/Caregiver Name</Label>
              <Input
                id="guardianName"
                placeholder="Full name of your main caregiver"
                value={formData.guardianName}
                onChange={(e) => updateField("guardianName", e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianEmail">Guardian Email ID (Required)</Label>
              <Input
                id="guardianEmail"
                type="email"
                placeholder="caregiver@example.com"
                value={formData.guardianEmail}
                onChange={(e) => updateField("guardianEmail", e.target.value)}
                className="h-12"
                required
              />
              <p className="text-xs text-gray-500">Weekly reports will be sent to this email</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Guardian Phone Number</Label>
              <Input
                id="guardianPhone"
                placeholder="Emergency contact number"
                value={formData.guardianPhone}
                onChange={(e) => updateField("guardianPhone", e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicEmail">Clinic Email ID (Optional)</Label>
              <Input
                id="clinicEmail"
                type="email"
                placeholder="doctor@clinic.com"
                value={formData.clinicEmail}
                onChange={(e) => updateField("clinicEmail", e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                placeholder="Emergency contact number"
                value={formData.emergencyContact}
                onChange={(e) => updateField("emergencyContact", e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={prevStep} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-green-700">Elder Information</h1>
        <div className="w-10" />
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className={`flex flex-col items-center space-y-1 ${
                index <= currentStep ? "text-green-600" : "text-gray-400"
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? "bg-green-100" : "bg-gray-100"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs">{step.title}</span>
              </div>
            );
          })}
        </div>
        <Progress value={(currentStep + 1) / steps.length * 100} className="h-2" />
      </div>

      {/* Form Content */}
      <div className="flex-1">
        <Card className="bg-white/90 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex-1 mr-2 h-12"
        >
          {currentStep === 0 ? "Back" : "Previous"}
        </Button>
        <Button
          onClick={nextStep}
          className="flex-1 ml-2 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          disabled={isLoading}
        >
          {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
          {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}