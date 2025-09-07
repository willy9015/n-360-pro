// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly confidence: number;
  readonly transcript: string;
}

interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VoicePanicButtonProps {
  onPanicDetected: (transcript: string) => void;
  className?: string;
}

export const VoicePanicButton: React.FC<VoicePanicButtonProps> = ({ 
  onPanicDetected, 
  className 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [confidence, setConfidence] = useState(0);
  const { toast } = useToast();

  const panicKeywords = [
    'emergencia', 'auxilio', 'ayuda', 'socorro', 'peligro', 
    'accidente', 'incendio', 'lesión', 'herido', 'evacuación',
    'emergency', 'help', 'danger', 'accident', 'fire'
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'es-ES';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({
          title: "Escucha activa",
          description: "El sistema está monitoreando comandos de voz de emergencia",
        });
      };

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
          .toLowerCase();

        const currentConfidence = event.results[event.results.length - 1][0].confidence;
        setConfidence(currentConfidence);

        // Check for panic keywords
        const hasPanicKeyword = panicKeywords.some(keyword => 
          transcript.includes(keyword.toLowerCase())
        );

        if (hasPanicKeyword && currentConfidence > 0.7) {
          onPanicDetected(transcript);
          setIsListening(false);
          recognitionInstance.stop();
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          toast({
            title: "Permiso requerido",
            description: "Se requiere acceso al micrófono para la detección de voz de emergencia",
            variant: "destructive",
          });
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "No compatible",
        description: "El navegador no soporta reconocimiento de voz",
        variant: "destructive",
      });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="text-center">
        <h3 className="font-semibold text-foreground mb-2">Pánico por Voz</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Di palabras como "emergencia", "auxilio" o "peligro"
        </p>
        
        <Button
          onClick={toggleListening}
          variant={isListening ? "destructive" : "outline"}
          size="lg"
          className={cn(
            "w-full transition-all duration-300",
            isListening && "animate-pulse"
          )}
        >
          {isListening ? (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Escuchando...
            </>
          ) : (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Activar Escucha
            </>
          )}
        </Button>

        {isListening && (
          <div className="mt-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <span className="text-xs text-muted-foreground">
                Confianza: {Math.round(confidence * 100)}%
              </span>
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Palabras clave monitoreadas: emergencia, auxilio, peligro
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};