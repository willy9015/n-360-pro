import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AIServices, type SafetyAnalysisResult, type AudioAnalysisResult } from '@/services/aiServices';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Brain, 
  BookOpen, 
  Award,
  Play,
  Users,
  Clock,
  Mic,
  MicOff,
  Send,
  FileText,
  Loader2,
  ArrowLeft,
  Volume2,
  CheckCircle,
  Trophy
} from 'lucide-react';

const AITraining = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportText, setReportText] = useState('');
  const [textAnalysis, setTextAnalysis] = useState<SafetyAnalysisResult | null>(null);
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysisResult | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [activeModule, setActiveModule] = useState<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        processAudioCommand(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Grabación Iniciada",
        description: "Habla ahora para registrar tu reporte de seguridad"
      });
    } catch (error) {
      toast({
        title: "Error de Micrófono",
        description: "No se pudo acceder al micrófono",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioCommand = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    try {
      const result = await AIServices.processAudioCommand(audioBlob);
      setAudioAnalysis(result);
      
      toast({
        title: "Audio Procesado",
        description: `Comando reconocido con prioridad ${result.priority}`,
        variant: result.priority === 'emergency' ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Error de Procesamiento",
        description: "No se pudo procesar el comando de audio",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeText = async () => {
    if (!reportText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await AIServices.analyzeSafetyText(reportText);
      setTextAnalysis(result);
      
      toast({
        title: "Análisis Completado",
        description: `Nivel de riesgo: ${result.riskLevel}`,
        variant: result.riskLevel === 'critical' || result.riskLevel === 'high' ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Error de Análisis",
        description: "No se pudo analizar el texto",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

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

      {/* AI Safety Assistant */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Asistente de Seguridad IA
        </h3>
        
        {/* Text Analysis */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Análisis de Texto</h4>
          <div className="space-y-3">
            <Textarea
              placeholder="Escribe tu reporte de seguridad aquí..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="min-h-[100px]"
            />
            
            <Button 
              onClick={analyzeText} 
              disabled={!reportText.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Analizar Reporte
            </Button>

            {textAnalysis && (
              <div className="mt-4 space-y-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Nivel de Riesgo:</span>
                  <Badge variant={getRiskColor(textAnalysis.riskLevel)}>
                    {textAnalysis.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <span className="font-medium">Riesgos Identificados:</span>
                  <ul className="mt-1 text-sm text-muted-foreground">
                    {textAnalysis.risks.map((risk, index) => (
                      <li key={index}>• {risk}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <span className="font-medium">Recomendaciones:</span>
                  <ul className="mt-1 text-sm text-muted-foreground">
                    {textAnalysis.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Confianza: {Math.round(textAnalysis.confidence * 100)}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audio Recording */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Comando de Voz</h4>
          <div className="space-y-3">
            <Button 
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing}
              className="w-full"
              variant={isRecording ? "destructive" : "outline"}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4 mr-2" />
              ) : (
                <Mic className="w-4 h-4 mr-2" />
              )}
              {isRecording ? 'Detener Grabación' : 'Grabar Comando'}
            </Button>

            {isAnalyzing && (
              <div className="text-center py-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Procesando audio...</p>
              </div>
            )}

            {audioAnalysis && (
              <div className="mt-4 space-y-3 p-3 bg-muted/50 rounded-lg">
                <div>
                  <span className="font-medium">Texto Transcrito:</span>
                  <p className="text-sm text-muted-foreground mt-1">"{audioAnalysis.text}"</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Prioridad:</span>
                  <Badge variant={getPriorityColor(audioAnalysis.priority)}>
                    {audioAnalysis.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <span className="font-medium">Intención:</span>
                  <p className="text-sm text-muted-foreground">{audioAnalysis.intent}</p>
                </div>
                
                <div>
                  <span className="font-medium">Acciones Sugeridas:</span>
                  <ul className="mt-1 text-sm text-muted-foreground">
                    {audioAnalysis.actions.map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

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