import React, { useState } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PanicButtonProps {
  onPanic: () => void;
  className?: string;
}

export const PanicButton: React.FC<PanicButtonProps> = ({ onPanic, className }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    onPanic();
    // Reset after animation
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <button
      onClick={handlePress}
      className={cn(
        "relative w-20 h-20 rounded-full bg-gradient-to-br from-alert to-alert-light",
        "shadow-[0_0_30px_hsl(var(--alert)/0.6)] hover:shadow-[0_0_40px_hsl(var(--alert)/0.8)]",
        "transform transition-all duration-200 active:scale-95",
        "border-4 border-alert-foreground/20",
        "flex items-center justify-center group",
        isPressed && "scale-110 shadow-[0_0_50px_hsl(var(--alert)/1)]",
        className
      )}
    >
      {/* Pulsing effect */}
      <div className="absolute inset-0 rounded-full bg-alert animate-ping opacity-30" />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-alert-foreground">
        <AlertTriangle className="w-6 h-6 mb-1" />
        <span className="text-xs font-bold">SOS</span>
      </div>
      
      {/* Ripple effect on press */}
      {isPressed && (
        <div className="absolute inset-0 rounded-full border-4 border-alert-foreground animate-ping" />
      )}
    </button>
  );
};