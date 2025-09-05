import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AIServices, type PPEDetectionResult } from '@/services/aiServices';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  HardHat,
  Eye,
  Hand,
  Loader2,
  Scan,
  ArrowLeft,
  XCircle
} from 'lucide-react';

const PPEControl = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PPEDetectionResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await AIServices.analyzePPECompliance(file);
      setAnalysisResult(result);
      
      toast({
        title: result.detected ? "EPP Detectado" : "EPP No Detectado",
        description: `Análisis completado con ${Math.round(result.confidence * 100)}% de confianza`,
        variant: result.detected ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Error de Análisis",
        description: "No se pudo procesar la imagen. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCameraCapture = () => {
    toast({
      title: "Función de Cámara",
      description: "Selecciona una imagen desde tu dispositivo por ahora"
    });
    fileInputRef.current?.click();
  };

  const ppeItems = [
    { name: "Casco de Seguridad", status: "compliant", confidence: 95 },
    { name: "Gafas de Protección", status: "compliant", confidence: 88 },
    { name: "Chaleco Reflectante", status: "missing", confidence: 92 },
    { name: "Calzado de Seguridad", status: "compliant", confidence: 90 },
    { name: "Guantes de Protección", status: "non-compliant", confidence: 78 }
  ];

  const recentInspections = [
    { worker: "Juan Pérez", area: "Taller Mecánico", compliance: 95, time: "10:30 AM" },
    { worker: "María González", area: "Área de Soldadura", compliance: 82, time: "09:15 AM" },
    { worker: "Carlos Ruiz", area: "Almacén", compliance: 100, time: "08:45 AM" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'missing':
        return <XCircle className="w-4 h-4 text-alert" />;
      case 'non-compliant':
        return <XCircle className="w-4 h-4 text-yellow-500" />;
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
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Control EPP</h1>
        </div>
      </div>

      {/* Image Analysis Section */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Scan className="w-5 h-5 mr-2" />
          Análisis de EPP con IA
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleCameraCapture} 
              className="flex-1" 
              variant="outline"
              disabled={isAnalyzing}
            >
              <Camera className="w-4 h-4 mr-2" />
              Usar Cámara
            </Button>
            
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              className="flex-1"
              disabled={isAnalyzing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Imagen
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {isAnalyzing && (
            <div className="text-center py-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Analizando imagen con IA...</p>
            </div>
          )}

          {selectedImage && (
            <div className="mt-4">
              <img 
                src={selectedImage} 
                alt="Imagen seleccionada" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {analysisResult && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Estado del EPP:</span>
                <Badge variant={analysisResult.detected ? "default" : "destructive"}>
                  {analysisResult.detected ? "Detectado" : "No Detectado"}
                </Badge>
              </div>
              
              <div>
                <span className="font-medium">Confianza:</span>
                <Progress value={analysisResult.confidence * 100} className="mt-1" />
                <span className="text-xs text-muted-foreground">
                  {Math.round(analysisResult.confidence * 100)}%
                </span>
              </div>

              {analysisResult.equipment.length > 0 && (
                <div>
                  <span className="font-medium">EPP Detectado:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysisResult.equipment.map((item, index) => (
                      <Badge key={index} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.missing.length > 0 && (
                <div>
                  <span className="font-medium text-destructive">EPP Faltante:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysisResult.missing.map((item, index) => (
                      <Badge key={index} variant="destructive">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="font-medium">Recomendaciones:</span>
                <ul className="mt-1 text-sm text-muted-foreground">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* PPE Status Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">EPP Completo</p>
          <p className="text-xs text-muted-foreground">85%</p>
        </Card>
        
        <Card className="p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">Revisiones</p>
          <p className="text-xs text-muted-foreground">3 pendientes</p>
        </Card>
      </div>

      {/* PPE Status */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Estado Actual de EPP</h2>
        <div className="space-y-3">
          {ppeItems.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <Badge variant={item.status === 'compliant' ? 'secondary' : 'destructive'}>
                    {item.confidence}% confianza
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Inspections */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Inspecciones Recientes</h2>
        <div className="space-y-3">
          {recentInspections.map((inspection, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{inspection.worker}</p>
                  <p className="text-xs text-muted-foreground">{inspection.area}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{inspection.compliance}%</p>
                  <p className="text-xs text-muted-foreground">{inspection.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PPEControl;