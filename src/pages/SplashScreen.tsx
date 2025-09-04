import React, { useEffect } from 'react';
import { Shield } from 'lucide-react';
import guardian360Logo from '@/assets/guardian360-logo.png';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-glow flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo Container */}
        <div className="relative mb-8">
          {/* Pulsing background circle */}
          <div className="absolute inset-0 w-32 h-32 mx-auto bg-primary-foreground/20 rounded-full animate-ping" />
          <div className="absolute inset-2 w-28 h-28 mx-auto bg-primary-foreground/10 rounded-full animate-ping animation-delay-200" />
          
          {/* Logo */}
          <div className="relative z-10 w-32 h-32 mx-auto bg-primary-foreground/90 rounded-full flex items-center justify-center shadow-corporate">
            <img 
              src={guardian360Logo} 
              alt="Guardián360" 
              className="w-20 h-20 animate-pulse"
            />
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-4xl font-bold text-primary-foreground mb-2 tracking-wide">
          Guardián360
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-primary-foreground/90 mb-8 font-medium">
          Seguridad Industrial Inteligente
        </p>

        {/* Features Highlights */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-center text-primary-foreground/80">
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm">IA Predictiva • EPP Inteligente</span>
          </div>
          <div className="text-primary-foreground/80 text-sm">
            ISO 45001 • Comunidad Empresarial
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce animation-delay-200" />
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce animation-delay-400" />
          </div>
        </div>

        {/* Version */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-xs text-primary-foreground/60">
            v2.1.0 - Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;