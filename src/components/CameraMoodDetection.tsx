import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Camera, RefreshCw, Loader2 } from 'lucide-react';
import { saveCameraMood } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface CameraMoodDetectionProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

// Singleton pattern to ensure models are only loaded once
let modelsLoaded = false;
let faceapi: any = null;

export function CameraMoodDetection({ onComplete, onBack }: CameraMoodDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedMood, setDetectedMood] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [useManualMode, setUseManualMode] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const detectionIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    loadModels();
    // Check if HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setCameraError('Camera requires HTTPS connection. Please use a secure connection.');
      setUseManualMode(true);
    }
    return () => {
      stopCamera();
    };
  }, []);

  const loadModels = async () => {
    if (modelsLoaded && faceapi) {
      console.log('Face detection models already loaded');
      setIsModelLoading(false);
      return;
    }

    try {
      setIsModelLoading(true);
      
      // Suppress TensorFlow.js warnings
      const originalWarn = console.warn;
      const originalLog = console.log;
      console.warn = (...args) => {
        const msg = args[0]?.toString() || '';
        if (msg.includes('already registered') || msg.includes('Overwriting')) {
          return; // Suppress these warnings
        }
        originalWarn.apply(console, args);
      };
      console.log = (...args) => {
        const msg = args[0]?.toString() || '';
        if (msg.includes('already registered') || msg.includes('Overwriting')) {
          return; // Suppress these logs
        }
        originalLog.apply(console, args);
      };
      
      // Dynamically import face-api only when needed
      faceapi = await import('@vladmandic/face-api');
      
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      
      // Restore console methods
      console.warn = originalWarn;
      console.log = originalLog;
      
      modelsLoaded = true;
      console.log('✓ Face detection models loaded successfully');
      setIsModelLoading(false);
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('Failed to load AI models. Please refresh the page.');
      setIsModelLoading(false);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          startDetection();
        };
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = '';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission was denied. Please allow camera access to continue.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found on this device. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application. Please close other apps using the camera.';
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        errorMessage = 'Camera does not meet requirements. Trying with default settings...';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera access is not supported. Please use HTTPS or a secure connection.';
      } else if (error.name === 'TypeError') {
        errorMessage = 'Camera access is not supported in this browser. Please try Chrome, Firefox, or Safari.';
      } else {
        errorMessage = `Camera error: ${error.message || 'Unknown error occurred'}`;
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    setDetectedMood(null);
  };

  const startDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = window.setInterval(async () => {
      await detectFace();
    }, 1000); // Detect every second
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState !== 4) return;

    try {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections) {
        // Update canvas size to match video
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        // Resize detections to match display size
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Clear previous drawings
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Draw detections
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        // Update detected mood
        const expressions = detections.expressions;
        const dominantExpression = Object.entries(expressions).reduce((a, b) => 
          expressions[a[0] as keyof faceapi.FaceExpressions] > expressions[b[0] as keyof faceapi.FaceExpressions] ? a : b
        );

        setDetectedMood({
          primaryMood: dominantExpression[0],
          confidence: (dominantExpression[1] * 100).toFixed(1),
          expressions: {
            happy: (expressions.happy * 100).toFixed(1),
            sad: (expressions.sad * 100).toFixed(1),
            angry: (expressions.angry * 100).toFixed(1),
            fearful: (expressions.fearful * 100).toFixed(1),
            disgusted: (expressions.disgusted * 100).toFixed(1),
            surprised: (expressions.surprised * 100).toFixed(1),
            neutral: (expressions.neutral * 100).toFixed(1),
          }
        });
      } else {
        // Clear canvas if no face detected
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    } catch (error) {
      console.error('Error detecting face:', error);
    }
  };

  const captureMood = async () => {
    if (!detectedMood) {
      toast.error('No face detected. Please position your face in the camera.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate brief analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsAnalyzing(false);
    setIsSaving(true);

    try {
      const moodData = {
        ...detectedMood,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
      };

      await saveCameraMood(moodData);
      toast.success('Mood captured successfully!');
      
      // Stop camera and complete
      stopCamera();
      onComplete(moodData);
    } catch (error) {
      console.error('Error saving mood:', error);
      toast.error('Failed to save mood. Please try again.');
      setIsSaving(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const emojiMap: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      fearful: '😨',
      disgusted: '🤢',
      surprised: '😮',
      neutral: '😐',
    };
    return emojiMap[mood] || '😐';
  };

  const getMoodColor = (mood: string) => {
    const colorMap: { [key: string]: string } = {
      happy: 'text-green-600',
      sad: 'text-blue-600',
      angry: 'text-red-600',
      fearful: 'text-purple-600',
      disgusted: 'text-yellow-600',
      surprised: 'text-orange-600',
      neutral: 'text-gray-600',
    };
    return colorMap[mood] || 'text-gray-600';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        detectFaceFromImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectFaceFromImage = async (imageData: string) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageData;
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const detections = await faceapi
          .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections) {
          // Update canvas size to match video
          const displaySize = { width: img.width, height: img.height };
          faceapi.matchDimensions(canvas, displaySize);

          // Resize detections to match display size
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          // Clear previous drawings
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          // Draw detections
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

          // Update detected mood
          const expressions = detections.expressions;
          const dominantExpression = Object.entries(expressions).reduce((a, b) => 
            expressions[a[0] as keyof faceapi.FaceExpressions] > expressions[b[0] as keyof faceapi.FaceExpressions] ? a : b
          );

          setDetectedMood({
            primaryMood: dominantExpression[0],
            confidence: (dominantExpression[1] * 100).toFixed(1),
            expressions: {
              happy: (expressions.happy * 100).toFixed(1),
              sad: (expressions.sad * 100).toFixed(1),
              angry: (expressions.angry * 100).toFixed(1),
              fearful: (expressions.fearful * 100).toFixed(1),
              disgusted: (expressions.disgusted * 100).toFixed(1),
              surprised: (expressions.surprised * 100).toFixed(1),
              neutral: (expressions.neutral * 100).toFixed(1),
            }
          });
        } else {
          // Clear canvas if no face detected
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      } catch (error) {
        console.error('Error detecting face:', error);
      }
    };
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <CardTitle className="text-2xl">AI Mood Detection</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Using real-time facial expression analysis</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isModelLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading AI models...</p>
            </div>
          ) : (
            <>
              {/* Camera View */}
              <div className="relative">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                  
                  {!isCameraActive && !cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Camera is off</p>
                      </div>
                    </div>
                  )}

                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90 p-6">
                      <div className="text-center text-white max-w-md">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Camera className="w-10 h-10 text-red-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Camera Access Required</h3>
                        <p className="text-gray-300 mb-6">{cameraError}</p>
                        <div className="bg-blue-900/50 rounded-lg p-4 text-left text-sm space-y-2 mb-4">
                          <p className="font-medium text-blue-200">How to enable camera:</p>
                          <ul className="space-y-1 text-gray-300 ml-4">
                            <li>• Click the camera icon in your browser's address bar</li>
                            <li>• Select "Allow" or "Always allow" for camera access</li>
                            <li>• Refresh the page if needed</li>
                          </ul>
                        </div>
                        <Button
                          onClick={startCamera}
                          variant="outline"
                          className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}

                  {isCameraActive && !detectedMood && (
                    <div className="absolute top-4 left-4 bg-yellow-500/90 text-white px-4 py-2 rounded-lg">
                      <p className="text-sm font-medium">No face detected</p>
                    </div>
                  )}

                  {isCameraActive && detectedMood && (
                    <div className="absolute top-4 left-4 bg-green-500/90 text-white px-4 py-2 rounded-lg">
                      <p className="text-sm font-medium">✓ Face detected</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Camera Controls */}
              <div className="flex gap-4">
                {!isCameraActive ? (
                  <>
                    <Button
                      onClick={startCamera}
                      className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      size="lg"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start Camera
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="flex-1 h-14"
                      size="lg"
                    >
                      📸 Upload Photo
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      className="flex-1 h-14"
                      size="lg"
                    >
                      Stop Camera
                    </Button>
                    <Button
                      onClick={captureMood}
                      disabled={!detectedMood || isAnalyzing || isSaving}
                      className="flex-1 h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          Capture Mood
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>

              {/* Upload Mode Indicator */}
              {uploadedImage && !isCameraActive && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">✓ Photo uploaded successfully.</span> The AI is analyzing your facial expression.
                  </p>
                </div>
              )}

              {/* Detected Mood Display */}
              {detectedMood && (
                <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-3">{getMoodEmoji(detectedMood.primaryMood)}</div>
                      <h3 className={`text-2xl font-semibold capitalize ${getMoodColor(detectedMood.primaryMood)}`}>
                        {detectedMood.primaryMood}
                      </h3>
                      <p className="text-gray-600 mt-1">Confidence: {detectedMood.confidence}%</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 mb-3">Expression Breakdown:</p>
                      {Object.entries(detectedMood.expressions).map(([emotion, value]) => (
                        <div key={emotion} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getMoodEmoji(emotion)}</span>
                            <span className="text-sm capitalize text-gray-700">{emotion}</span>
                          </div>
                          <div className="flex items-center gap-3 flex-1 ml-4">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-12 text-right">{value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Save button for uploaded images */}
                    {uploadedImage && !isCameraActive && (
                      <div className="mt-6">
                        <Button
                          onClick={captureMood}
                          disabled={isAnalyzing || isSaving}
                          className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          size="lg"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : isSaving ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Camera className="w-5 h-5 mr-2" />
                              Save Mood Analysis
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <h4 className="font-medium text-blue-900 mb-2">📋 Instructions:</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Position your face clearly in front of the camera</li>
                    <li>• Ensure good lighting for accurate detection</li>
                    <li>• Hold still while the AI analyzes your expression</li>
                    <li>• Click "Capture Mood" when you're ready to save</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}