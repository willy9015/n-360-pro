import React from 'react';
import { ArrowLeft, MapPin, AlertTriangle, Cloud, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const RiskMap = () => {
  const navigate = useNavigate();

  const alerts = [
    {
      type: "Climática",
      description: "Vientos fuertes esperados",
      severity: "medium",
      time: "Próximas 2 horas",
      icon: Cloud
    },
    {
      type: "Sísmica",
      description: "Actividad sísmica baja detectada",
      severity: "low",
      time: "Hace 15 min",
      icon: Activity
    },
    {
      type: "Industrial",
      description: "Concentración de gases elevada - Zona B",
      severity: "high",
      time: "Ahora",
      icon: AlertTriangle
    }
  ];

  const riskZones = [
    { zone: "Zona A - Producción", risk: "Bajo", workers: 25, color: "green" },
    { zone: "Zona B - Química", risk: "Alto", workers: 8, color: "red" },
    { zone: "Zona C - Almacén", risk: "Medio", workers: 15, color: "yellow" },
    { zone: "Zona D - Oficinas", risk: "Bajo", workers: 32, color: "green" }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <MapPin className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Mapa de Riesgos</h1>
        </div>
      </div>

      {/* Map Placeholder */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-muted/50 to-muted">
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary-glow/5 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Mapa Interactivo de Riesgos</p>
            <p className="text-xs text-muted-foreground mt-1">Vista de planta con zonas de riesgo</p>
          </div>
        </div>
      </Card>

      {/* Active Alerts */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Alertas Activas</h2>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  alert.severity === 'high' ? 'bg-alert/10' :
                  alert.severity === 'medium' ? 'bg-yellow-500/10' : 'bg-green-500/10'
                }`}>
                  <alert.icon className={`w-4 h-4 ${
                    alert.severity === 'high' ? 'text-alert' :
                    alert.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{alert.type}</span>
                    <Badge variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'default' : 'secondary'}>
                      {alert.severity === 'high' ? 'Alto' : alert.severity === 'medium' ? 'Medio' : 'Bajo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Risk Zones */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Zonas de Riesgo</h2>
        <div className="space-y-3">
          {riskZones.map((zone, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    zone.color === 'red' ? 'bg-alert' :
                    zone.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{zone.zone}</p>
                    <p className="text-xs text-muted-foreground">{zone.workers} trabajadores</p>
                  </div>
                </div>
                <Badge variant={zone.color === 'red' ? 'destructive' : zone.color === 'yellow' ? 'default' : 'secondary'}>
                  Riesgo {zone.risk}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskMap;