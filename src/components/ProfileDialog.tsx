import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ElderInfoForm } from './ElderInfoForm';
import { User, Heart, Pill, Mail, Edit, X } from 'lucide-react';

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  elderData: any;
  onUpdate: (data: any) => void;
}

export function ProfileDialog({ isOpen, onClose, elderData, onUpdate }: ProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditComplete = (data: any) => {
    onUpdate(data);
    setIsEditing(false);
  };

  const InfoSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="pl-10 space-y-2">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium text-gray-800">{value || 'Not provided'}</span>
    </div>
  );

  if (isEditing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Profile Information</DialogTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <ElderInfoForm
            onBack={() => setIsEditing(false)}
            onComplete={handleEditComplete}
            initialData={elderData}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>My Profile</DialogTitle>
              <DialogDescription>View and manage your personal health information</DialogDescription>
            </div>
            <Button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Personal Information */}
          <Card>
            <CardContent className="pt-6">
              <InfoSection title="Personal Information" icon={User}>
                <InfoItem label="Age" value={elderData?.age} />
                <InfoItem label="Gender" value={elderData?.gender} />
                <InfoItem label="Blood Group" value={elderData?.bloodGroup} />
                <InfoItem label="Disability Status" value={elderData?.disability} />
              </InfoSection>
            </CardContent>
          </Card>

          {/* Health Details */}
          <Card>
            <CardContent className="pt-6">
              <InfoSection title="Health Details" icon={Heart}>
                {elderData?.medicalConditions && elderData.medicalConditions.length > 0 && (
                  <div className="py-1">
                    <span className="text-sm text-gray-600 block mb-1">Medical Conditions:</span>
                    <div className="flex flex-wrap gap-2">
                      {elderData.medicalConditions.map((condition: string, index: number) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {elderData?.otherConditions && (
                  <div className="py-1">
                    <span className="text-sm text-gray-600 block mb-1">Other Conditions:</span>
                    <p className="text-sm text-gray-800">{elderData.otherConditions}</p>
                  </div>
                )}
                {elderData?.currentMedications && (
                  <div className="py-1">
                    <span className="text-sm text-gray-600 block mb-1">Current Medications:</span>
                    <p className="text-sm text-gray-800">{elderData.currentMedications}</p>
                  </div>
                )}
              </InfoSection>
            </CardContent>
          </Card>

          {/* Medication Details */}
          <Card>
            <CardContent className="pt-6">
              <InfoSection title="Medication Details" icon={Pill}>
                <InfoItem label="Primary Medication" value={elderData?.tabletName} />
                <InfoItem label="Frequency" value={elderData?.tabletFrequency} />
                {elderData?.medicationNotes && (
                  <div className="py-1">
                    <span className="text-sm text-gray-600 block mb-1">Notes:</span>
                    <p className="text-sm text-gray-800">{elderData.medicationNotes}</p>
                  </div>
                )}
              </InfoSection>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6">
              <InfoSection title="Emergency Contacts" icon={Mail}>
                <InfoItem label="Guardian Name" value={elderData?.guardianName} />
                <InfoItem label="Guardian Email" value={elderData?.guardianEmail} />
                <InfoItem label="Guardian Phone" value={elderData?.guardianPhone} />
                <InfoItem label="Clinic Email" value={elderData?.clinicEmail} />
                <InfoItem label="Emergency Contact" value={elderData?.emergencyContact} />
              </InfoSection>
            </CardContent>
          </Card>

          {/* Update Info */}
          {elderData?.updatedAt && (
            <div className="text-center text-sm text-gray-500">
              Last updated: {new Date(elderData.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
