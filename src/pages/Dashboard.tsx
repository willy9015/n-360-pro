import React from 'react';
import { 
  Brain, 
  Shield, 
  MapPin, 
  FileCheck, 
  GraduationCap, 
  Users,
  Camera,
  BarChart3
} from 'lucide-react';
import { PanicButton } from '@/components/ui/panic-button';
import { QuickAccessCard } from '@/components/dashboard/QuickAccessCard';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import guardian360Logo from '@/assets/guardian360-logo.png';

const Dashboard = () => {
  const { toast } = useToast();

  const handlePanicActivation = () => {
    toast({
      title: "🚨 Alerta de Emergencia Activada",
      description: "Se ha notificado a los equipos de respuesta. Mantén la calma.",
      variant: "destructive",
    });
  };

  const quickAccessItems = [
    {
      icon: Brain,
      title: "IA Predictiva",
      description: "Análisis de riesgos en tiempo real",
      variant: 'primary' as const,
      onClick: () => toast({ title: "IA Predictiva", description: "Analizando patrones de riesgo..." })
    },
    {
      icon: Shield,
      title: "Control EPP",
      description: "Verificación visual de equipos",
      variant: 'default' as const,
      onClick: () => toast({ title: "Control EPP", description: "Iniciando verificación de equipos..." })
    },
    {
      icon: MapPin,
      title: "Mapa de Riesgos",
      description: "Alertas climáticas y sísmicas",
      variant: 'alert' as const,
      onClick: () => toast({ title: "Mapa de Riesgos", description: "Cargando alertas ambientales..." })
    },
    {
      icon: FileCheck,
      title: "Auditoría ISO 45001",
      description: "Evaluación automatizada",
      variant: 'default' as const,
      onClick: () => toast({ title: "Auditoría ISO", description: "Generando reporte de cumplimiento..." })
    },
    {
      icon: GraduationCap,
      title: "Capacitación IA",
      description: "Entrenamiento interactivo",
      variant: 'primary' as const,
      onClick: () => toast({ title: "Capacitación", description: "Iniciando módulo de entrenamiento..." })
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Red empresarial colaborativa",
      variant: 'default' as const,
      onClick: () => toast({ title: "Comunidad", description: "Accediendo a la red empresarial..." })
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <img src={guardian360Logo} alt="Guardián360" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Guardián360</h1>
            <p className="text-sm text-muted-foreground">Seguridad Industrial Inteligente</p>
          </div>
        </div>
        
        {/* Status Card */}
        <Card className="p-3 bg-gradient-to-r from-primary/10 to-primary-glow/20 border-primary/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-foreground">Sistema Activo</span>
          </div>
        </Card>
      </div>

      {/* Panic Button - Prominent placement */}
      <div className="flex justify-center mb-8">
        <div className="text-center">
          <PanicButton onPanic={handlePanicActivation} />
          <p className="text-xs text-muted-foreground mt-2">Botón de Pánico</p>
          <p className="text-xs text-muted-foreground">Toque • Voz • Vibración</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 text-center bg-gradient-to-br from-primary/5 to-primary-light/10">
          <BarChart3 className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-lg font-bold text-foreground">98%</p>
          <p className="text-xs text-muted-foreground">Cumplimiento</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-green-500/5 to-green-600/10">
          <Shield className="w-5 h-5 mx-auto mb-2 text-green-600" />
          <p className="text-lg font-bold text-foreground">24</p>
          <p className="text-xs text-muted-foreground">Días sin incidentes</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-blue-500/5 to-blue-600/10">
          <Users className="w-5 h-5 mx-auto mb-2 text-blue-600" />
          <p className="text-lg font-bold text-foreground">156</p>
          <p className="text-xs text-muted-foreground">Trabajadores activos</p>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 gap-3">
          {quickAccessItems.map((item, index) => (
            <QuickAccessCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              variant={item.variant}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6 p-4">
        <h3 className="font-semibold text-foreground mb-3">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Capacitación completada</span>
            <span className="text-muted-foreground">Hace 2h</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">EPP verificado</span>
            <span className="text-muted-foreground">Hace 4h</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Reporte de riesgo generado</span>
            <span className="text-muted-foreground">Ayer</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;