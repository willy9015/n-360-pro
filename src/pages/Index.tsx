import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import guardian360Logo from '@/assets/guardian360-logo.png';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to splash screen after a brief moment
    const timer = setTimeout(() => {
      navigate('/splash');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-glow flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <img src={guardian360Logo} alt="Guardián 45001" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">Guardián 45001</h1>
          <p className="text-primary-foreground/80 text-lg">Plataforma ISO 45001 Completa</p>
        </div>

        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
          <h2 className="text-xl font-semibold text-primary-foreground mb-2">
            Bienvenido al Futuro de la Seguridad
          </h2>
          <p className="text-primary-foreground/80 text-sm mb-6">
            IA predictiva, control EPP automatizado y respuesta inteligente a emergencias
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/splash')}
              className="w-full bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
              variant="outline"
            >
              Comenzar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              onClick={() => navigate('/manual')}
              className="w-full"
              variant="ghost"
            >
              Ver Manual de Usuario
            </Button>
          </div>
        </Card>

        <p className="text-primary-foreground/60 text-xs mt-6">
          Redirigiendo automáticamente...
        </p>
      </div>
    </div>
  );
};

export default Index;
