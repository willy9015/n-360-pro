import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, Play, Volume2, CheckCircle, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const AITraining = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<number | null>(null);

  const trainingModules = [
    {
      id: 1,
      title: "Seguridad en Espacios Confinados",
      duration: "25 min",
      progress: 100,
      status: "completed",
      type: "Interactivo"
    },
    {
      id: 2,
      title: "Uso Correcto de EPP",
      duration: "18 min",
      progress: 65,
      status: "in-progress",
      type: "Simulación IA"
    },
    {
      id: 3,
      title: "Procedimientos de Emergencia",
      duration: "30 min",
      progress: 0,
      status: "available",
      type: "Reconocimiento de Voz"
    },
    {
      id: 4,
      title: "Manejo de Sustancias Químicas",
      duration: "22 min",
      progress: 0,
      status: "locked",
      type: "Realidad Aumentada"
    }
  ];

  const achievements = [
    { name: "Experto en Seguridad", description: "Completó 5 módulos consecutivos", earned: true },
    { name: "Respuesta Rápida", description: "Tiempo récord en simulacros", earned: true },
    { name: "Mentor", description: "Ayudó a 10 compañeros", earned: false }
  ];

  const handleStartModule = (moduleId: number) => {
    setActiveModule(moduleId);
    setTimeout(() => setActiveModule(null), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Play className="w-4 h-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <GraduationCap className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Capacitación IA</h1>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-primary-glow/10">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Progreso General</h2>
          <p className="text-sm text-muted-foreground">2 de 4 módulos completados</p>
        </div>
        <Progress value={50} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>50% completado</span>
          <span>Tiempo total: 95 min</span>
        </div>
      </Card>

      {/* Training Modules */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Módulos de Entrenamiento</h2>
        <div className="space-y-3">
          {trainingModules.map((module) => (
            <Card key={module.id} className={`p-4 ${module.status === 'locked' ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(module.status)}
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{module.title}</h3>
                    <p className="text-xs text-muted-foreground">{module.duration} • {module.type}</p>
                  </div>
                </div>
                <Badge variant={module.status === 'completed' ? 'secondary' : module.status === 'in-progress' ? 'default' : 'outline'}>
                  {module.status === 'completed' ? 'Completado' : 
                   module.status === 'in-progress' ? 'En progreso' : 
                   module.status === 'locked' ? 'Bloqueado' : 'Disponible'}
                </Badge>
              </div>
              
              {module.progress > 0 && (
                <div className="mb-3">
                  <Progress value={module.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{module.progress}% completado</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={module.status === 'completed' ? 'secondary' : 'default'}
                  disabled={module.status === 'locked' || activeModule === module.id}
                  onClick={() => handleStartModule(module.id)}
                  className="flex-1"
                >
                  {activeModule === module.id ? (
                    "Cargando..."
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      {module.status === 'completed' ? 'Revisar' : 'Iniciar'}
                    </>
                  )}
                </Button>
                <Button size="sm" variant="ghost">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Logros</h2>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <Card key={index} className={`p-4 ${!achievement.earned ? 'opacity-60' : ''}`}>
              <div className="flex items-center space-x-3">
                <Trophy className={`w-5 h-5 ${achievement.earned ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AITraining;