import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AIServices } from '@/services/aiServices';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Shield,
  BarChart3,
  Target,
  Zap,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Activity
} from 'lucide-react';

const PredictiveAI = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const runPredictiveAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate historical data
      const mockData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
        incidents: Math.floor(Math.random() * 5),
        compliance: Math.random() * 100,
        trainingHours: Math.floor(Math.random() * 8)
      }));

      const result = await AIServices.predictSafetyIncidents(mockData);
      setPredictions(result);
      setLastUpdate(new Date());
      
      toast({
        title: "Análisis Completado",
        description: `Riesgo calculado: ${Math.round(result.riskScore)}%`,
        variant: result.riskScore > 70 ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Error de Análisis",
        description: "No se pudo completar el análisis predictivo",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Auto-run analysis on component mount
    runPredictiveAnalysis();
  }, []);

  const getRiskLevel = (score: number): { level: string; color: string; variant: any } => {
    if (score >= 80) return { level: 'Crítico', color: 'text-red-600', variant: 'destructive' };
    if (score >= 60) return { level: 'Alto', color: 'text-orange-600', variant: 'secondary' };
    if (score >= 40) return { level: 'Medio', color: 'text-yellow-600', variant: 'outline' };
    return { level: 'Bajo', color: 'text-green-600', variant: 'default' };
  };

  const riskPredictions = [
    {
      type: "Alto Riesgo",
      area: "Zona de Soldadura",
      probability: 85,
      factors: ["Temperatura elevada", "Ventilación insuficiente", "Fatiga del operario"],
      severity: "high"
    },
    {
      type: "Riesgo Medio",
      area: "Área de Almacén",
      probability: 65,
      factors: ["Carga manual repetitiva", "Superficie húmeda"],
      severity: "medium"
    },
    {
      type: "Bajo Riesgo",
      area: "Oficinas Administrativas",
      probability: 25,
      factors: ["Postura prolongada"],
      severity: "low"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">IA Predictiva</h1>
        </div>
      </div>

      {/* AI Analysis Controls */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Análisis Predictivo IA</h3>
          <Button 
            onClick={runPredictiveAnalysis} 
            disabled={isAnalyzing}
            size="sm"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Actualizar
          </Button>
        </div>

        {isAnalyzing && (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Analizando datos con IA...</p>
          </div>
        )}

        {predictions && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Nivel de Riesgo:</span>
                <Badge variant={getRiskLevel(predictions.riskScore).variant}>
                  {getRiskLevel(predictions.riskScore).level}
                </Badge>
              </div>
              <Progress value={predictions.riskScore} className="mb-1" />
              <span className="text-xs text-muted-foreground">
                {Math.round(predictions.riskScore)}% de probabilidad de incidente
              </span>
            </div>

            <div>
              <h4 className="font-medium mb-2">Predicciones:</h4>
              <ul className="space-y-1">
                {predictions.predictions.map((pred: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <AlertTriangle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0 text-orange-500" />
                    {pred}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recomendaciones:</h4>
              <ul className="space-y-1">
                {predictions.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <Shield className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {lastUpdate && (
              <p className="text-xs text-muted-foreground text-center">
                Última actualización: {lastUpdate.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center bg-gradient-to-br from-primary/5 to-primary-glow/10">
          <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-lg font-bold text-foreground">92%</p>
          <p className="text-xs text-muted-foreground">Precisión del modelo</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-alert/5 to-alert-light/10">
          <Activity className="w-5 h-5 mx-auto mb-2 text-alert" />
          <p className="text-lg font-bold text-foreground">15</p>
          <p className="text-xs text-muted-foreground">Incidentes prevenidos</p>
        </Card>
      </div>

      {/* Risk Predictions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Predicciones de Riesgo</h2>
        {riskPredictions.map((prediction, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant={prediction.severity === 'high' ? 'destructive' : prediction.severity === 'medium' ? 'default' : 'secondary'}>
                    {prediction.type}
                  </Badge>
                  <span className="text-sm font-medium text-foreground">{prediction.area}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    prediction.severity === 'high' ? 'text-alert' : 
                    prediction.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <span className="text-sm text-muted-foreground">Probabilidad: {prediction.probability}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Factores de Riesgo:</p>
              <div className="flex flex-wrap gap-1">
                {prediction.factors.map((factor, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PredictiveAI;