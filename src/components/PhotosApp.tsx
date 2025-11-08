import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Grid3X3, Heart, Share, Trash2, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PhotosAppProps {
  onBack: () => void;
}

export function PhotosApp({ onBack }: PhotosAppProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');

  // Mock photo gallery with placeholder images
  const photos = [
    { id: '1', url: 'https://images.unsplash.com/photo-1516627145497-ae4af0d2989b?w=400&h=400&fit=crop', title: 'Family Dinner', date: 'Today' },
    { id: '2', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', title: 'Garden Walk', date: 'Yesterday' },
    { id: '3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', title: 'Morning Coffee', date: 'Yesterday' },
    { id: '4', url: 'https://images.unsplash.com/photo-1494790108755-2616c2c47b4d?w=400&h=400&fit=crop', title: 'Happy Moment', date: '2 days ago' },
    { id: '5', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', title: 'Reading Time', date: '3 days ago' },
    { id: '6', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', title: 'Afternoon Tea', date: '3 days ago' },
    { id: '7', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', title: 'Visit with Sarah', date: '1 week ago' },
    { id: '8', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', title: 'Park Bench', date: '1 week ago' },
    { id: '9', url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop', title: 'Sunny Day', date: '1 week ago' },
  ];

  const handlePhotoClick = (photoId: string) => {
    setSelectedPhoto(photoId);
    setViewMode('single');
  };

  const handleBackToGrid = () => {
    setSelectedPhoto(null);
    setViewMode('grid');
  };

  const selectedPhotoData = photos.find(p => p.id === selectedPhoto);

  if (viewMode === 'single' && selectedPhotoData) {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/80 text-white">
          <Button variant="ghost" onClick={handleBackToGrid} className="p-2 text-white hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg">{selectedPhotoData.title}</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="p-2 text-white hover:bg-white/20">
              <Heart className="w-6 h-6" />
            </Button>
            <Button variant="ghost" className="p-2 text-white hover:bg-white/20">
              <Share className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Photo */}
        <div className="flex-1 flex items-center justify-center p-4">
          <ImageWithFallback
            src={selectedPhotoData.url}
            alt={selectedPhotoData.title}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        {/* Bottom info */}
        <div className="p-4 bg-black/80 text-white">
          <p className="text-center text-sm opacity-70">{selectedPhotoData.date}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl text-gray-800">Photos</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="p-2">
            <Search className="w-6 h-6" />
          </Button>
          <Button variant="ghost" className="p-2">
            <Grid3X3 className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Library sections */}
      <div className="p-4 space-y-6">
        {/* Recent section */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-3">Recent</h2>
          <div className="grid grid-cols-3 gap-1">
            {photos.slice(0, 6).map((photo) => (
              <div 
                key={photo.id} 
                className="aspect-square cursor-pointer"
                onClick={() => handlePhotoClick(photo.id)}
              >
                <ImageWithFallback
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Albums section */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-3">Albums</h2>
          <div className="space-y-3">
            <Card className="p-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📷</span>
                </div>
                <div>
                  <p className="font-medium">All Photos</p>
                  <p className="text-sm text-gray-500">{photos.length} photos</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Favorites</p>
                  <p className="text-sm text-gray-500">3 photos</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👵</span>
                </div>
                <div>
                  <p className="font-medium">Family</p>
                  <p className="text-sm text-gray-500">12 photos</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* All Photos */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-3">All Photos</h2>
          <div className="grid grid-cols-3 gap-1">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="aspect-square cursor-pointer"
                onClick={() => handlePhotoClick(photo.id)}
              >
                <ImageWithFallback
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}