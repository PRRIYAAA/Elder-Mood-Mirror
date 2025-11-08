import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { saveElderInfo, saveDoctorInfo } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { User, Heart, Pill, Mail, Building, Award, Stethoscope, MapPin, Phone } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: 'elder' | 'doctor';
  currentData: any;
  onSave: (data: any) => void;
}

export function EditProfileDialog({ open, onOpenChange, role, currentData, onSave }: EditProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(currentData || {});

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
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateMedicalConditions = (condition: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      medicalConditions: checked 
        ? [...(prev.medicalConditions || []), condition]
        : (prev.medicalConditions || []).filter((c: string) => c !== condition)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (role === 'elder') {
        await saveElderInfo(formData);
        toast.success('Elder profile updated successfully!');
      } else {
        await saveDoctorInfo(formData);
        toast.success('Doctor profile updated successfully!');
      }
      onSave(formData);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (role === 'elder') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Your Profile</DialogTitle>
            <DialogDescription>
              Update your personal and health information
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Select value={formData.age?.toString()} onValueChange={(value) => updateField('age', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age" />
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
                  <Select value={formData.gender} onValueChange={(value) => updateField('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
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
                  <Select value={formData.bloodGroup} onValueChange={(value) => updateField('bloodGroup', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
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
                  <Select value={formData.disability} onValueChange={(value) => updateField('disability', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select disability" />
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
            </TabsContent>

            <TabsContent value="health" className="space-y-4 pt-4">
              <div className="space-y-3">
                <Label>Medical Conditions</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                  {medicalConditionsList.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={(formData.medicalConditions || []).includes(condition)}
                        onCheckedChange={(checked) => updateMedicalConditions(condition, checked as boolean)}
                      />
                      <label htmlFor={condition} className="text-sm">
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
                  placeholder="Describe any other medical conditions..."
                  value={formData.otherConditions || ''}
                  onChange={(e) => updateField('otherConditions', e.target.value)}
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  placeholder="List your current medications..."
                  value={formData.currentMedications || ''}
                  onChange={(e) => updateField('currentMedications', e.target.value)}
                  className="min-h-20"
                />
              </div>
            </TabsContent>

            <TabsContent value="medications" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="tabletName">Primary Medication Name</Label>
                <Input
                  id="tabletName"
                  placeholder="e.g., Paracetamol"
                  value={formData.tabletName || ''}
                  onChange={(e) => updateField('tabletName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tabletFrequency">Medication Frequency</Label>
                <Select value={formData.tabletFrequency} onValueChange={(value) => updateField('tabletFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
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
                  placeholder="Special instructions..."
                  value={formData.medicationNotes || ''}
                  onChange={(e) => updateField('medicationNotes', e.target.value)}
                  className="min-h-20"
                />
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  placeholder="Full name"
                  value={formData.guardianName || ''}
                  onChange={(e) => updateField('guardianName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianEmail">Guardian Email</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  placeholder="caregiver@example.com"
                  value={formData.guardianEmail || ''}
                  onChange={(e) => updateField('guardianEmail', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input
                  id="guardianPhone"
                  placeholder="Phone number"
                  value={formData.guardianPhone || ''}
                  onChange={(e) => updateField('guardianPhone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicEmail">Clinic Email</Label>
                <Input
                  id="clinicEmail"
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={formData.clinicEmail || ''}
                  onChange={(e) => updateField('clinicEmail', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Emergency number"
                  value={formData.emergencyContact || ''}
                  onChange={(e) => updateField('emergencyContact', e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Doctor profile edit
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Doctor Profile</DialogTitle>
          <DialogDescription>
            Update your professional information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="specialty">Medical Specialty</Label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="specialty"
                placeholder="e.g., Geriatrics, Internal Medicine"
                value={formData.specialty || ''}
                onChange={(e) => updateField('specialty', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Medical License Number</Label>
            <div className="relative">
              <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="licenseNumber"
                placeholder="License number"
                value={formData.licenseNumber || ''}
                onChange={(e) => updateField('licenseNumber', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital/Clinic Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="hospital"
                placeholder="Hospital or clinic name"
                value={formData.hospital || ''}
                onChange={(e) => updateField('hospital', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <div className="relative">
              <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="yearsOfExperience"
                type="number"
                placeholder="e.g., 10"
                value={formData.yearsOfExperience || ''}
                onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Clinic Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="address"
                placeholder="Clinic address"
                value={formData.address || ''}
                onChange={(e) => updateField('address', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Contact Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="phone"
                placeholder="Phone number"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Professional Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="doctor@clinic.com"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
