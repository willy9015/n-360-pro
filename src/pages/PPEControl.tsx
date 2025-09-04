import React, { useState } from 'react';
import { ArrowLeft, Shield, Camera, CheckCircle, XCircle, Scan } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const PPEControl = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

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

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

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

      {/* Camera Section */}
      <Card className="p-6 mb-6 text-center bg-gradient-to-br from-primary/5 to-primary-glow/10">
        <Camera className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="font-semibold text-foreground mb-2">Verificación Visual</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Usa la cámara para verificar automáticamente el uso correcto de EPP
        </p>
        <Button 
          onClick={handleScan}
          disabled={isScanning}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          <Scan className="w-4 h-4 mr-2" />
          {isScanning ? "Escaneando..." : "Iniciar Escaneo"}
        </Button>
      </Card>

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