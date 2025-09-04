import React, { useState } from 'react';
import { ArrowLeft, Brain, TrendingUp, AlertTriangle, Activity, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const PredictiveAI = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

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

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center bg-gradient-to-br from-primary/5 to-primary-glow/10">
          <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-lg font-bold text-foreground">73%</p>
          <p className="text-xs text-muted-foreground">Precisión del modelo</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-alert/5 to-alert-light/10">
          <Activity className="w-5 h-5 mx-auto mb-2 text-alert" />
          <p className="text-lg font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground">Incidentes prevenidos</p>
        </Card>
      </div>

      {/* Analyze Button */}
      <div className="mb-6">
        <Button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-primary to-primary-glow"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isAnalyzing ? "Analizando..." : "Ejecutar Análisis IA"}
        </Button>
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