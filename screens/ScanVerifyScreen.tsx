import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, MapPin, Check, Lock, ChevronDown, PenLine, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { ScreenName, UserProfile } from '../types';
import { Button } from '../components/Button';
import { extractProfileFromImage } from '../services/ai';
import { t } from '../translations';

interface Props {
  onNavigate: (screen: ScreenName) => void;
  userProfile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function ScanVerifyScreen({ onNavigate, userProfile, updateProfile }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lang = userProfile.language;

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Unable to access camera. Please enter details manually.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setImage(imageData);
        stopCamera();
        await analyzeImage(imageData);
      }
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    // Remove data:image/jpeg;base64, prefix for API
    const cleanBase64 = base64Image.split(',')[1];
    
    try {
      const extractedData = await extractProfileFromImage(cleanBase64);
      if (extractedData) {
        updateProfile({ ...extractedData, profileImage: base64Image });
      }
    } catch (e) {
      console.error("Analysis failed", e);
      setError("Could not read ID card clearly.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setImage(null);
    startCamera();
  };

  if (error) {
     return (
       <div className="flex flex-col h-full bg-surface items-center justify-center p-6 text-center">
         <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
         <h2 className="text-lg font-bold text-slate-900 mb-2">Camera Error</h2>
         <p className="text-slate-500 mb-6">{error}</p>
         <Button onClick={() => onNavigate(ScreenName.PROFILE_WIZARD)}>Enter Manually</Button>
       </div>
     );
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="px-4 py-4 flex items-center gap-4 border-b border-primary/5 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => onNavigate(ScreenName.PROFILE_METHOD)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-primary flex-1 text-center pr-10">{t('scanTitle', lang)}</h1>
      </div>

      <div className="flex-1 px-5 py-6 overflow-y-auto no-scrollbar space-y-6">
        
        {/* Camera/Image View */}
        <div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-white bg-black h-64 flex items-center justify-center">
          {!image ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-white/50 m-8 rounded-lg pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-400"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-400"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-400"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-400"></div>
              </div>
            </>
          ) : (
             <img src={image} alt="Captured ID" className="w-full h-full object-cover" />
          )}
          
          <canvas ref={canvasRef} className="hidden" />

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
              <RefreshCw className="w-8 h-8 text-white animate-spin mb-2" />
              <p className="text-white font-medium text-sm">Scanning details...</p>
            </div>
          )}
        </div>

        {!image ? (
           <div className="flex justify-center">
             <button 
               onClick={captureImage}
               className="w-16 h-16 bg-white rounded-full border-4 border-primary/20 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
             >
               <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                 <Camera className="w-6 h-6 text-white" />
               </div>
             </button>
           </div>
        ) : (
           <div className="flex justify-center">
             <button onClick={handleRetake} className="text-sm font-semibold text-primary flex items-center gap-1 bg-primary/10 px-4 py-2 rounded-full">
                <RefreshCw className="w-4 h-4" /> Retake
             </button>
           </div>
        )}

        <div className="text-center space-y-2 pt-2">
          <h2 className="text-xl font-bold text-slate-900">{t('verifyTitle', lang)}</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">{t('verifySubtitle', lang)}</p>
        </div>

        <div className="space-y-4 pb-20">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary/70 uppercase tracking-wide ml-1">{t('fullName', lang)}</label>
            <div className="relative">
              <input 
                type="text" 
                value={userProfile.name} 
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
              />
              <PenLine className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary/70 uppercase tracking-wide ml-1">{t('dob', lang)}</label>
            <div className="relative">
              <input 
                type="text" 
                value={userProfile.ageRange || ''} 
                onChange={(e) => updateProfile({ ageRange: e.target.value })}
                placeholder="e.g. 18-35"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary/70 uppercase tracking-wide ml-1">{t('state', lang)}</label>
            <div className="relative">
              <input 
                 type="text" 
                 value={userProfile.state || ''} 
                 onChange={(e) => updateProfile({ state: e.target.value })}
                 className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <Button onClick={() => onNavigate(ScreenName.PROFILE_WIZARD)} icon>{t('confirmProceed', lang)}</Button>
      </div>
    </div>
  );
}